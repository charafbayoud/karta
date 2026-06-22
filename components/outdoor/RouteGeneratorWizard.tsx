"use client";

import { useCallback, useEffect, useState } from "react";
import { GoogleMapView } from "@/components/outdoor/GoogleMapView";
import { SaveRouteControl } from "@/components/dashboard/SaveRouteControl";
import { SportSelector } from "@/components/outdoor/SportSelector";
import type { OutdoorSport } from "@/types/gps-art";
import {
  defaultRouteGeneratorDistance,
  getRouteGeneratorDistances,
  type RouteGeneratorDistance,
  type RouteGeneratorResponse,
  type RouteGeneratorResult,
} from "@/types/route-generator";

const RECENT_LOOP_KEYS = "karta-route-generator-recent";

function loadRecentLoopKeys(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(RECENT_LOOP_KEYS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch {
    return [];
  }
}

function rememberLoopKeys(results: RouteGeneratorResult[]) {
  if (typeof window === "undefined") return;
  const previous = loadRecentLoopKeys();
  const next = [
    ...results.map((result) => result.variantKey),
    ...previous,
  ];
  const unique = [...new Set(next)].slice(0, 16);
  sessionStorage.setItem(RECENT_LOOP_KEYS, JSON.stringify(unique));
}

function downloadGpx(gpx: string, routeName: string) {
  const blob = new Blob([gpx], { type: "application/gpx+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${routeName.replace(/\s+/g, "-").toLowerCase()}.gpx`;
  link.click();
  URL.revokeObjectURL(url);
}

function RouteResultCard({
  result,
  title,
  targetDistanceKm,
  variant = "default",
}: {
  result: RouteGeneratorResult;
  title?: string;
  targetDistanceKm?: number;
  variant?: "default" | "alternative";
}) {
  const distanceDelta =
    targetDistanceKm != null
      ? Math.abs(result.distanceKm - targetDistanceKm)
      : null;
  const isAlternative = variant === "alternative";

  return (
    <article
      className={`route-generator-card${isAlternative ? " route-generator-card--alternative" : ""}`}
    >
      <h3>{title ?? result.routeName}</h3>
      <div className="outdoor-stats route-generator-card-stats">
        <div>
          <span className="karta-label">Distance</span>
          <p className="font-data">{result.distanceKm} km</p>
          {targetDistanceKm != null && distanceDelta != null && distanceDelta / targetDistanceKm <= 0.15 && (
            <p className="outdoor-hint">Objectif {targetDistanceKm} km</p>
          )}
        </div>
        <div>
          <span className="karta-label">Durée</span>
          <p className="font-data">~{result.durationMin} min</p>
        </div>
        <div>
          <span className="karta-label">D+</span>
          <p className="font-data">~{result.elevationM} m</p>
        </div>
      </div>

      {result.warning && <p className="outdoor-warning">{result.warning}</p>}

      {!isAlternative && result.segmentsUsed.length > 0 && (
        <>
          <p className="karta-label">Segments Strava</p>
          <ul className="route-generator-segments">
            {result.segmentsUsed.map((segment) => (
              <li key={segment.id}>
                {segment.name} — {segment.distanceKm} km
              </li>
            ))}
          </ul>
        </>
      )}

      {isAlternative && result.segmentsUsed.length > 0 && (
        <p className="outdoor-hint route-generator-card-segments-hint">
          {result.segmentsUsed.length} segment{result.segmentsUsed.length > 1 ? "s" : ""} Strava
        </p>
      )}

      <div className="route-generator-card-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={() => downloadGpx(result.gpx, result.routeName)}
        >
          Télécharger GPX
        </button>
        <SaveRouteControl
          loginHref="/login?next=/outdoor"
          payload={{
            routeName: result.routeName,
            type: "outdoor",
            sport: result.sport,
            distanceKm: result.distanceKm,
            elevationM: result.elevationM,
            durationMin: result.durationMin,
            gpxData: result.gpx,
          }}
          className="btn-secondary result-save-btn"
        />
      </div>
    </article>
  );
}

export function RouteGeneratorWizard() {
  const [sport, setSport] = useState<OutdoorSport>("cycling");
  const [distanceKm, setDistanceKm] = useState<RouteGeneratorDistance>(
    defaultRouteGeneratorDistance("cycling")
  );
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [stravaConnected, setStravaConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RouteGeneratorResult | null>(null);
  const [alternatives, setAlternatives] = useState<RouteGeneratorResult[]>([]);

  useEffect(() => {
    fetch("/api/strava/status")
      .then((res) => res.json())
      .then((data) => setStravaConnected(Boolean(data.connected)))
      .catch(() => setStravaConnected(false));
  }, []);

  useEffect(() => {
    const distances = getRouteGeneratorDistances(sport);
    setDistanceKm((current) =>
      distances.includes(current) ? current : defaultRouteGeneratorDistance(sport)
    );
    setResult(null);
    setAlternatives([]);
  }, [sport]);

  function handleSportChange(nextSport: OutdoorSport) {
    setSport(nextSport);
    setError("");
  }

  const handleLocationChange = useCallback((nextLat: number, nextLng: number) => {
    setLat(nextLat);
    setLng(nextLng);
    setResult(null);
    setAlternatives([]);
    setError("");
  }, []);

  async function useCurrentLocation() {
    setError("");
    setResult(null);
    setAlternatives([]);

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
        handleLocationChange(position.coords.latitude, position.coords.longitude);
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
          setError("Position introuvable. Clique sur la carte ou cherche une adresse.");
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

  async function generateLoop() {
    if (lat === null || lng === null) {
      setError("Choisis un point de départ sur la carte.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setAlternatives([]);

    try {
      const response = await fetch("/api/route-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport,
          distanceKm,
          start: { lat, lng },
          seed: Date.now() ^ Math.floor(Math.random() * 1_000_000_000),
          excludeKeys: loadRecentLoopKeys(),
        }),
      });

      const data = (await response.json()) as RouteGeneratorResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Génération impossible.");
      }

      setResult(data.route);
      setAlternatives(data.alternatives ?? []);
      rememberLoopKeys([data.route, ...(data.alternatives ?? [])]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Génération impossible.");
    } finally {
      setLoading(false);
    }
  }

  if (stravaConnected === false) {
    return (
      <div className="outdoor-step">
        <p className="auth-error" role="alert">
          Connecte Strava pour utiliser le Route Generator.
        </p>
        <a href="/api/strava/auth?returnTo=/outdoor" className="btn-primary">
          Connecter Strava
        </a>
      </div>
    );
  }

  return (
    <div className="outdoor-wizard product-wizard">
      <div className="product-progress" aria-label="Progress">
        <span className="product-progress-step is-active">Configure</span>
        <span className="product-progress-line" />
        <span
          className={
            lat !== null ? "product-progress-step is-active" : "product-progress-step"
          }
        >
          Location
        </span>
        <span className="product-progress-line" />
        <span
          className={result ? "product-progress-step is-active" : "product-progress-step"}
        >
          Results
        </span>
      </div>

      <div className="product-split">
        <div className="product-split-main">
          <section className="product-section">
            <h2 className="product-section-title">Sport</h2>
            <p className="outdoor-hint">Cycling, running, or walking — routes adapt to your activity.</p>
            <SportSelector value={sport} onChange={handleSportChange} />
          </section>

          <section className="product-section">
            <h2 className="product-section-title">Distance</h2>
            <p className="outdoor-hint">
              We calibrate the loop to your target — not a straight line on the map.
            </p>
            <div className="outdoor-option-grid product-distance-grid">
              {getRouteGeneratorDistances(sport).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`outdoor-option ${distanceKm === value ? "is-selected" : ""}`}
                  onClick={() => setDistanceKm(value)}
                >
                  <span className="font-data">{value}</span>
                  <span className="outdoor-option-unit">km</span>
                </button>
              ))}
            </div>
          </section>

          <section className="product-section">
            <h2 className="product-section-title">Departure point</h2>
            <p className="outdoor-hint">Click the map, search an address, or use your current location.</p>
            <GoogleMapView
              lat={lat}
              lng={lng}
              points={result?.points}
              showSearch
              onLocationChange={handleLocationChange}
              height={360}
            />
            <div className="outdoor-location-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={useCurrentLocation}
                disabled={locating}
              >
                {locating ? "Locating…" : "Use my location"}
              </button>
            </div>
            {lat !== null && lng !== null && (
              <p className="outdoor-hint font-data">
                {lat.toFixed(5)}, {lng.toFixed(5)}
              </p>
            )}
          </section>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <div className="product-generate-bar">
            <button
              type="button"
              className="btn-primary"
              onClick={generateLoop}
              disabled={loading || lat === null || lng === null}
            >
              {loading ? "Generating…" : "Generate new loop"}
            </button>
          </div>
        </div>

        <aside className="product-split-aside">
          <div className="product-summary">
            <p className="karta-label">Summary</p>
            <dl className="product-summary-list">
              <div>
                <dt>Sport</dt>
                <dd className="capitalize">{sport}</dd>
              </div>
              <div>
                <dt>Target</dt>
                <dd className="font-data">{distanceKm} km</dd>
              </div>
              <div>
                <dt>Start</dt>
                <dd>{lat !== null && lng !== null ? "Pin set" : "Not set"}</dd>
              </div>
            </dl>
            <ul className="product-summary-notes">
              <li>Fresh route every generation</li>
              <li>Up to 3 alternatives</li>
              <li>GPX for Garmin & Wahoo</li>
            </ul>
          </div>
        </aside>
      </div>

      {result && (
        <section className="product-section product-results">
          <h2>Recommended loop</h2>
          <RouteResultCard result={result} targetDistanceKm={distanceKm} />
        </section>
      )}

      {alternatives.length > 0 && (
        <section className="product-section product-results">
          <h2>Alternatives nearby</h2>
          <p className="outdoor-hint">
            Same ~{distanceKm} km target — different Strava segments each time.
          </p>
          <div className="route-generator-alternatives" role="list">
            {alternatives.map((alternative) => (
              <RouteResultCard
                key={alternative.variantKey}
                result={alternative}
                targetDistanceKm={distanceKm}
                variant="alternative"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
