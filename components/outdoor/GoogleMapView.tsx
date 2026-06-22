"use client";

import { useEffect, useRef, useState } from "react";

type MapPoint = { lat: number; lng: number };

type GoogleMapViewProps = {
  lat: number | null;
  lng: number | null;
  points?: MapPoint[];
  strokes?: MapPoint[][];
  onLocationChange?: (lat: number, lng: number, address?: string) => void;
  showSearch?: boolean;
  height?: number;
};

type MapsClasses = {
  Map: typeof google.maps.Map;
  Marker: typeof google.maps.Marker;
  Polyline: typeof google.maps.Polyline;
};

function waitForGoogleBootstrap(maxMs = 12_000): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now();

    const tick = () => {
      if (window.google?.maps && typeof window.google.maps.importLibrary === "function") {
        resolve();
        return;
      }

      if (Date.now() - started > maxMs) {
        reject(new Error("Google Maps n'a pas chargé. Vérifie la clé API et la facturation."));
        return;
      }

      window.setTimeout(tick, 100);
    };

    tick();
  });
}

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (window.google?.maps && typeof window.google.maps.importLibrary === "function") {
    return Promise.resolve();
  }

  const existing = document.querySelector('script[data-karta-maps="true"]');
  if (existing) return waitForGoogleBootstrap();

  return new Promise((resolve, reject) => {
    (window as Window & { gm_authFailure?: () => void }).gm_authFailure = () => {
      reject(
        new Error(
          "Clé Google refusée. Autorise http://localhost:3000/* dans Google Cloud → Credentials → Restrictions HTTP."
        )
      );
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.dataset.kartaMaps = "true";
    script.onload = () => {
      waitForGoogleBootstrap().then(resolve).catch(reject);
    };
    script.onerror = () =>
      reject(new Error("Impossible de charger Google Maps. Vérifie ta connexion internet."));
    document.head.appendChild(script);
  });
}

async function loadMapsClasses(): Promise<MapsClasses> {
  const mapsLib = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;

  if (!mapsLib.Map || !mapsLib.Polyline || !google.maps.Marker) {
    throw new Error("Classes Google Maps introuvables. Active Maps JavaScript API.");
  }

  return {
    Map: mapsLib.Map,
    Marker: google.maps.Marker,
    Polyline: mapsLib.Polyline,
  };
}

export function GoogleMapView({
  lat,
  lng,
  points,
  strokes,
  onLocationChange,
  showSearch = false,
  height = 280,
}: GoogleMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const classesRef = useRef<MapsClasses | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const polylineRefs = useRef<google.maps.Polyline[]>([]);
  const onLocationChangeRef = useRef(onLocationChange);

  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loadError, setLoadError] = useState("");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    setMounted(true);
  }, []);

  onLocationChangeRef.current = onLocationChange;

  useEffect(() => {
    if (!apiKey) return;

    let cancelled = false;

    loadGoogleMapsScript(apiKey)
      .then(() => loadMapsClasses())
      .then((classes) => {
        if (cancelled) return;
        classesRef.current = classes;
        setReady(true);
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Carte indisponible.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  useEffect(() => {
    if (!ready || !containerRef.current || !classesRef.current) return;

    const { Map } = classesRef.current;
    const center =
      lat !== null && lng !== null ? { lat, lng } : { lat: 48.8566, lng: 2.3522 };

    if (!mapRef.current) {
      mapRef.current = new Map(containerRef.current, {
        center,
        zoom: lat !== null ? 14 : 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      mapRef.current.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (!event.latLng || !onLocationChangeRef.current) return;
        onLocationChangeRef.current(event.latLng.lat(), event.latLng.lng());
      });
    }
  }, [ready, lat, lng]);

  useEffect(() => {
    if (!ready || !mapRef.current || !classesRef.current) return;

    const { Marker } = classesRef.current;

    if (lat === null || lng === null) {
      markerRef.current?.setMap(null);
      return;
    }

    const position = { lat, lng };

    if (!markerRef.current) {
      markerRef.current = new Marker({
        map: mapRef.current,
        position,
        draggable: Boolean(onLocationChange),
      });

      markerRef.current.addListener("dragend", () => {
        const next = markerRef.current?.getPosition();
        if (next && onLocationChangeRef.current) {
          onLocationChangeRef.current(next.lat(), next.lng());
        }
      });
    } else {
      markerRef.current.setPosition(position);
      markerRef.current.setMap(mapRef.current);
    }

    mapRef.current.panTo(position);
    mapRef.current.setZoom(14);
  }, [ready, lat, lng, onLocationChange]);

  useEffect(() => {
    if (!ready || !mapRef.current || !classesRef.current) return;

    const { Polyline } = classesRef.current;
    polylineRefs.current.forEach((polyline) => polyline.setMap(null));
    polylineRefs.current = [];

    const paths =
      strokes && strokes.length > 0
        ? strokes.filter((stroke) => stroke.length >= 2)
        : points && points.length >= 2
          ? [points]
          : [];

    if (paths.length === 0) return;

    const boundsPoints: MapPoint[] = [];

    for (const pathPoints of paths) {
      const path = pathPoints.map((point) => ({ lat: point.lat, lng: point.lng }));
      boundsPoints.push(...pathPoints);
      polylineRefs.current.push(
        new Polyline({
          path,
          geodesic: true,
          strokeColor: "#C4622D",
          strokeOpacity: 1,
          strokeWeight: 4,
          map: mapRef.current,
        })
      );
    }

    const lats = boundsPoints.map((point) => point.lat);
    const lngs = boundsPoints.map((point) => point.lng);
    mapRef.current.fitBounds(
      {
        north: Math.max(...lats),
        south: Math.min(...lats),
        east: Math.max(...lngs),
        west: Math.min(...lngs),
      },
      48
    );
  }, [ready, points, strokes]);

  useEffect(() => {
    if (!ready || !showSearch || !searchRef.current) return;

    let cancelled = false;
    let listener: google.maps.MapsEventListener | null = null;

    async function setupAutocomplete() {
      try {
        const placesLib = (await google.maps.importLibrary(
          "places"
        )) as google.maps.PlacesLibrary;

        if (cancelled || !searchRef.current) return;

        const autocomplete = new placesLib.Autocomplete(searchRef.current, {
          fields: ["geometry", "formatted_address"],
        });

        listener = autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const location = place.geometry?.location;
          if (!location || !onLocationChangeRef.current) return;

          onLocationChangeRef.current(
            location.lat(),
            location.lng(),
            place.formatted_address
          );
        });
      } catch {
        // Search is optional.
      }
    }

    setupAutocomplete();

    return () => {
      cancelled = true;
      if (listener) google.maps.event.removeListener(listener);
    };
  }, [ready, showSearch]);

  if (!apiKey) {
    return (
      <p className="outdoor-hint">
        Clé Google manquante — ajoute NEXT_PUBLIC_GOOGLE_MAPS_API_KEY dans .env.local
      </p>
    );
  }

  return (
    <div className="google-map-stack">
      {showSearch && mounted ? (
        <input
          ref={searchRef}
          type="search"
          className="google-map-search"
          placeholder="Rechercher une adresse"
          autoComplete="off"
          spellCheck={false}
        />
      ) : showSearch ? (
        <div className="google-map-search google-map-search--placeholder" aria-hidden="true" />
      ) : null}
      {loadError ? <p className="auth-error">{loadError}</p> : null}
      {!ready && !loadError ? <p className="outdoor-hint">Chargement de la carte…</p> : null}
      <div
        ref={containerRef}
        className="google-map-view"
        style={{ height, width: "100%", display: loadError ? "none" : "block" }}
      />
    </div>
  );
}
