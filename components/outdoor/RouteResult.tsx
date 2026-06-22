"use client";

import type { GpsArtResult } from "@/types/gps-art";
import { SaveRouteControl } from "@/components/dashboard/SaveRouteControl";
import { GoogleMapView } from "./GoogleMapView";
import { ShareImageCard } from "./ShareImageCard";

export function RouteResult({ result }: { result: GpsArtResult }) {
  const canDownload = Boolean(result.snappedToRoads && result.routeGpx);

  function downloadGpx(gpx: string) {
    const blob = new Blob([gpx], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.routeName.replace(/\s+/g, "-").toLowerCase()}-route.gpx`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="outdoor-result">
      <p className="karta-label">GPS Art result</p>
      <h1>{result.shapeLabel}</h1>
      <p className="dashboard-sub">{result.routeName}</p>

      <ShareImageCard result={result} />

      {canDownload && result.routeStrokes.length > 0 && (
        <div className="outdoor-step">
          <p className="karta-label">Tracé routable (GPX)</p>
          <GoogleMapView
            lat={result.routeStrokes[0]?.[0]?.lat ?? null}
            lng={result.routeStrokes[0]?.[0]?.lng ?? null}
            strokes={result.routeStrokes}
            height={320}
          />
        </div>
      )}

      <div className="outdoor-stats">
        <div>
          <span className="karta-label">Route distance</span>
          <p className="font-data">{result.distanceKm} km</p>
        </div>
        <div>
          <span className="karta-label">Duration</span>
          <p className="font-data">~{result.durationMin} min</p>
        </div>
        <div>
          <span className="karta-label">Elevation</span>
          <p className="font-data">~{result.elevationM} m</p>
        </div>
      </div>

      <p className="outdoor-hint">
        L&apos;image de partage montre la <strong>forme idéale</strong>. Le GPX et la carte
        ci-dessus suivent les <strong>routes et chemins praticables</strong>.
      </p>

      {result.warning && <p className="outdoor-warning">{result.warning}</p>}

      {!canDownload && (
        <p className="auth-error" role="alert">
          GPX non disponible — la route n&apos;a pas pu être calée sur des routes praticables.
        </p>
      )}

      <div className="outdoor-result-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={() => downloadGpx(result.routeGpx)}
          disabled={!canDownload}
        >
          Download GPX
        </button>
        {canDownload && (
          <SaveRouteControl
            loginHref="/login?next=/outdoor/gps-art/result"
            payload={{
              routeName: result.routeName,
              type: "gps-art",
              sport: result.sport,
              distanceKm: result.distanceKm,
              elevationM: result.elevationM,
              durationMin: result.durationMin,
              gpxData: result.routeGpx,
              shapeType: result.shapeLabel,
            }}
          />
        )}
      </div>
    </div>
  );
}
