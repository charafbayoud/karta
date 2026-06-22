"use client";

import Link from "next/link";
import { DeleteSavedRouteButton } from "@/components/dashboard/DeleteSavedRouteButton";
import { formatSavedRouteMeta } from "@/lib/saved-routes/format";
import type { SavedRoute } from "@/types/user";
import { PRIMARY_SPORT_LABELS, SAVED_ROUTE_TYPE_LABELS } from "@/types/user";

function downloadGpx(gpx: string, routeName: string) {
  const blob = new Blob([gpx], { type: "application/gpx+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${routeName.replace(/\s+/g, "-").toLowerCase()}.gpx`;
  link.click();
  URL.revokeObjectURL(url);
}

export function SavedRouteDetail({ route }: { route: SavedRoute }) {
  const meta = formatSavedRouteMeta(route);
  const hasGpx = Boolean(route.gpx_data?.trim());
  const canDownloadGpx = hasGpx && (route.type === "outdoor" || route.type === "gps-art");

  return (
    <article className="saved-route-detail">
      <header className="saved-route-detail-header">
        <p className="karta-label">{SAVED_ROUTE_TYPE_LABELS[route.type]}</p>
        <h1>{route.route_name}</h1>
        {meta && <p className="dashboard-sub">{meta}</p>}
      </header>

      <div className="outdoor-stats saved-route-detail-stats">
        {route.sport && (
          <div>
            <span className="karta-label">Sport</span>
            <p>{PRIMARY_SPORT_LABELS[route.sport]}</p>
          </div>
        )}
        {route.distance_km != null && (
          <div>
            <span className="karta-label">Distance</span>
            <p className="font-data">{route.distance_km} km</p>
          </div>
        )}
        {route.elevation_m != null && (
          <div>
            <span className="karta-label">Elevation</span>
            <p className="font-data">{route.elevation_m} m</p>
          </div>
        )}
        {route.duration_min != null && (
          <div>
            <span className="karta-label">Duration</span>
            <p className="font-data">~{route.duration_min} min</p>
          </div>
        )}
        {route.type === "indoor" && route.zwift_world && (
          <div>
            <span className="karta-label">Zwift world</span>
            <p>{route.zwift_world}</p>
          </div>
        )}
        {route.type === "indoor" && route.shape_type && (
          <div>
            <span className="karta-label">Difficulty</span>
            <p className="capitalize">{route.shape_type}</p>
          </div>
        )}
        {route.type === "gps-art" && route.shape_type && (
          <div>
            <span className="karta-label">Shape</span>
            <p>{route.shape_type}</p>
          </div>
        )}
        {route.type === "outdoor" && route.shape_type?.startsWith("strava:") && (
          <div>
            <span className="karta-label">Source</span>
            <p>Strava · #{route.shape_type.replace("strava:", "")}</p>
          </div>
        )}
        {route.type === "outdoor" && !route.shape_type?.startsWith("strava:") && route.shape_type && (
          <div>
            <span className="karta-label">Segments</span>
            <p>{route.shape_type}</p>
          </div>
        )}
      </div>

      <div className="saved-route-detail-actions">
        {canDownloadGpx && (
          <button
            type="button"
            className="btn-primary"
            onClick={() => downloadGpx(route.gpx_data!, route.route_name)}
          >
            Download GPX
          </button>
        )}

        {!hasGpx && (route.type === "outdoor" || route.type === "gps-art") && (
          <p className="outdoor-hint">
            GPX not stored for this saved route. Generate and save the route again to enable download.
          </p>
        )}

        {route.type === "indoor" && (
          <Link href="/app" className="btn-secondary">
            Find another indoor route
          </Link>
        )}

        {route.type === "gps-art" && (
          <Link href="/outdoor" className="btn-secondary">
            Generate a new loop
          </Link>
        )}

        {route.type === "outdoor" && (
          <Link href="/outdoor" className="btn-secondary">
            Generate a new loop
          </Link>
        )}

        <DeleteSavedRouteButton routeId={route.id} redirectTo="/my-routes" />
      </div>
    </article>
  );
}
