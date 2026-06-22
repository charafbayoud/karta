import Link from "next/link";
import { DeleteSavedRouteButton } from "@/components/dashboard/DeleteSavedRouteButton";
import { formatSavedRouteMeta } from "@/lib/saved-routes/format";
import type { SavedRoute } from "@/types/user";
import { SAVED_ROUTE_TYPE_LABELS } from "@/types/user";

interface SavedRoutesListProps {
  routes: SavedRoute[];
  emptyMessage: string;
  showDelete?: boolean;
  showViewAllLink?: boolean;
}

export function SavedRoutesList({
  routes,
  emptyMessage,
  showDelete = false,
  showViewAllLink = false,
}: SavedRoutesListProps) {
  if (routes.length === 0) {
    return <p className="dashboard-empty">{emptyMessage}</p>;
  }

  return (
    <>
      <ul className="saved-routes-list">
        {routes.map((route) => {
          const meta = formatSavedRouteMeta(route);
          const typeLabel = route.shape_type?.startsWith("strava:")
            ? "Strava Route"
            : SAVED_ROUTE_TYPE_LABELS[route.type];

          return (
            <li key={route.id} className="saved-route-item">
              <Link href={`/my-routes/${route.id}`} className="saved-route-item-link">
                <div className="saved-route-item-main">
                  <p className="saved-route-type">{typeLabel}</p>
                  <h3 className="saved-route-name">{route.route_name}</h3>
                  {meta && <p className="saved-route-meta">{meta}</p>}
                </div>
              </Link>
              {showDelete && <DeleteSavedRouteButton routeId={route.id} />}
            </li>
          );
        })}
      </ul>

      {showViewAllLink && (
        <Link href="/my-routes" className="saved-routes-view-all link-accent">
          View all saved routes →
        </Link>
      )}
    </>
  );
}
