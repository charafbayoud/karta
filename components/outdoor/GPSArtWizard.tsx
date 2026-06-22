"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AlphabetGrid } from "./AlphabetGrid";
import { GoogleMapView } from "./GoogleMapView";
import { SportSelector } from "./SportSelector";
import type { GpsArtDistance, GpsArtPoint, GpsArtResult, OutdoorSport } from "@/types/gps-art";
import { GPS_ART_MAX_LETTERS } from "@/types/gps-art";
import {
  defaultRouteGeneratorDistance,
  getRouteGeneratorDistances,
} from "@/types/route-generator";

type Step = 1 | 2 | 3 | 4;

export function GPSArtWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [sport, setSport] = useState<OutdoorSport>("cycling");
  const [text, setText] = useState("K");
  const [distanceKm, setDistanceKm] = useState<GpsArtDistance>(
    defaultRouteGeneratorDistance("cycling")
  );
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [previewStrokes, setPreviewStrokes] = useState<GpsArtPoint[][]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    const distances = getRouteGeneratorDistances(sport);
    setDistanceKm((current) =>
      distances.includes(current) ? current : defaultRouteGeneratorDistance(sport)
    );
    setPreviewStrokes([]);
  }, [sport]);

  function handleSportChange(nextSport: OutdoorSport) {
    setSport(nextSport);
    setError("");
  }

  const handleLocationChange = useCallback(
    (nextLat: number, nextLng: number, nextAddress?: string) => {
      setLat(nextLat);
      setLng(nextLng);
      setPreviewStrokes([]);
      if (nextAddress) setAddress(nextAddress);
      else setAddress(`${nextLat.toFixed(5)}, ${nextLng.toFixed(5)}`);
      setError("");
    },
    []
  );

  async function useCurrentLocation() {
    setError("");
    setPreviewStrokes([]);

    if (typeof window !== "undefined" && !window.isSecureContext) {
      setError(
        "La géoloc exige localhost ou HTTPS. Ouvre http://localhost:3000 (pas une adresse 192.168.x.x)."
      );
      return;
    }

    if (!navigator.geolocation) {
      setError("Géolocalisation indisponible dans ce navigateur. Utilise Chrome ou Safari.");
      return;
    }

    if (navigator.permissions) {
      try {
        const status = await navigator.permissions.query({ name: "geolocation" });
        if (status.state === "denied") {
          setError(
            "Accès refusé. Autorise la localisation dans les réglages du navigateur (icône cadenas → Localisation)."
          );
          return;
        }
      } catch {
        // Permissions API unsupported — continue with getCurrentPosition.
      }
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleLocationChange(
          position.coords.latitude,
          position.coords.longitude,
          `Current location (${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)})`
        );
        setLocating(false);
      },
      (geoError) => {
        setLocating(false);

        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError(
            "Accès refusé. Clique « Autoriser » quand le navigateur demande, ou active la localisation dans Réglages Système → Confidentialité → Localisation."
          );
          return;
        }

        if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          setError("Position introuvable. Clique sur la carte ou entre tes coordonnées.");
          return;
        }

        if (geoError.code === geoError.TIMEOUT) {
          setError("Délai dépassé. Réessaie ou clique directement sur la carte.");
          return;
        }

        setError("Impossible d'obtenir ta position. Clique sur la carte — c'est le plus simple.");
      },
      {
        enableHighAccuracy: false,
        timeout: 15_000,
        maximumAge: 60_000,
      }
    );
  }

  function buildRequestBody() {
    return {
      sport,
      shapeType: "alphabet" as const,
      text,
      distanceKm,
      start: { lat: lat!, lng: lng! },
    };
  }

  function validateStep(current: Step): boolean {
    const textPattern = new RegExp(`^[A-Za-z]{1,${GPS_ART_MAX_LETTERS}}$`);
    if (current === 2 && !textPattern.test(text)) {
      setError(`Entre 1 à ${GPS_ART_MAX_LETTERS} lettres (A–Z).`);
      return false;
    }

    setError("");
    return true;
  }

  function goToNextStep() {
    if (!validateStep(step)) return;
    setStep((current) => (current + 1) as Step);
  }

  async function generateRoute() {
    if (lat === null || lng === null) {
      setError("Choose a start location first.");
      return;
    }

    const textPattern = new RegExp(`^[A-Za-z]{1,${GPS_ART_MAX_LETTERS}}$`);
    if (!textPattern.test(text)) {
      setError(`Entre 1 à ${GPS_ART_MAX_LETTERS} lettres (A–Z).`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/gps-art", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRequestBody()),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Unable to generate route.");
      }

      if (!data.snappedToRoads || !data.routeGpx) {
        throw new Error(
          data.error ??
            "Impossible de générer un GPX praticable. Place le départ sur une route en ville."
        );
      }

      const result = data as GpsArtResult;
      sessionStorage.setItem("karta-gps-art-result", JSON.stringify(result));
      router.push("/outdoor/gps-art/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function previewOnMap() {
    if (lat === null || lng === null) {
      setError("Choose a start location first — click the map, search an address, or enter coordinates.");
      return;
    }

    setPreviewLoading(true);
    setError("");

    try {
      const res = await fetch("/api/gps-art", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRequestBody()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Preview failed.");

      const strokes = (data.routeStrokes ?? []) as GpsArtPoint[][];
      if (strokes.length === 0 || strokes.every((stroke) => stroke.length < 2)) {
        throw new Error(
          data.error ??
            "Aperçu impossible — choisis un départ sur une route en ville, pas sur l'eau."
        );
      }

      setPreviewStrokes(strokes);
    } catch (err) {
      setPreviewStrokes([]);
      setError(err instanceof Error ? err.message : "Preview failed.");
    } finally {
      setPreviewLoading(false);
    }
  }

  return (
    <div className="outdoor-wizard">
      <p className="karta-label">GPS Art · Étape {step} sur 4</p>

      {step === 1 && (
        <section className="outdoor-step">
          <h1>Choose your sport</h1>
          <SportSelector value={sport} onChange={handleSportChange} />
        </section>
      )}

      {step === 2 && (
        <section className="outdoor-step">
          <h1>Choose your letters</h1>
          <AlphabetGrid value={text} onChange={setText} />
          <label className="outdoor-field">
            Text (max {GPS_ART_MAX_LETTERS} letters)
            <input
              value={text}
              maxLength={GPS_ART_MAX_LETTERS}
              onChange={(event) =>
                setText(event.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())
              }
            />
          </label>
          <p className="outdoor-hint">
            {text.length}/{GPS_ART_MAX_LETTERS} characters
          </p>
        </section>
      )}

      {step === 3 && (
        <section className="outdoor-step">
          <h1>Choose distance</h1>
          <div className="outdoor-option-grid">
            {getRouteGeneratorDistances(sport).map((value) => (
              <button
                key={value}
                type="button"
                className={`outdoor-option ${distanceKm === value ? "is-selected" : ""}`}
                onClick={() => setDistanceKm(value)}
              >
                {value} km
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="outdoor-step">
          <h1>Start location</h1>
          <p className="outdoor-hint">
            Orientation automatique — la forme s&apos;adapte au terrain.
          </p>
          <GoogleMapView
            lat={lat}
            lng={lng}
            strokes={previewStrokes}
            showSearch
            onLocationChange={handleLocationChange}
          />
          <div className="outdoor-location-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={useCurrentLocation}
              disabled={locating}
            >
              {locating ? "Locating…" : "Use my current location"}
            </button>
          </div>
          {error && step === 4 && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
          <label className="outdoor-field">
            Or enter coordinates
            <div className="outdoor-coords">
              <input
                type="number"
                step="0.00001"
                placeholder="Latitude"
                value={lat ?? ""}
                onChange={(event) =>
                  setLat(event.target.value ? Number(event.target.value) : null)
                }
              />
              <input
                type="number"
                step="0.00001"
                placeholder="Longitude"
                value={lng ?? ""}
                onChange={(event) =>
                  setLng(event.target.value ? Number(event.target.value) : null)
                }
              />
            </div>
          </label>
          {address && <p className="outdoor-hint">{address}</p>}
          {lat !== null && lng !== null && (
            <p className="outdoor-hint font-data">
              Start: {lat.toFixed(5)}, {lng.toFixed(5)}
            </p>
          )}
          <button
            type="button"
            className="btn-secondary"
            onClick={previewOnMap}
            disabled={previewLoading || lat === null || lng === null}
          >
            {previewLoading ? "Loading preview…" : "Preview route on map"}
          </button>
          {previewStrokes.length > 0 && (
            <p className="outdoor-hint">
              Route preview loaded ({previewStrokes.length} strokes, sur routes).
            </p>
          )}
        </section>
      )}

      {error && step !== 4 && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      <div className="outdoor-footer">
        {step > 1 && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setStep((current) => (current - 1) as Step)}
          >
            Back
          </button>
        )}
        {step < 4 ? (
          <button type="button" className="btn-primary" onClick={goToNextStep}>
            Next
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={generateRoute} disabled={loading}>
            {loading ? "Generating…" : "Generate GPS Art"}
          </button>
        )}
      </div>
    </div>
  );
}
