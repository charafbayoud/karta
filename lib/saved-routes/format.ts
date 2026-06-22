import type { SavedRoute } from "@/types/user";

export function formatSavedRouteMeta(route: SavedRoute): string {
  const parts: string[] = [];

  if (route.shape_type && route.type === "gps-art") {
    parts.push(route.shape_type);
  }

  if (route.shape_type?.startsWith("strava:") && route.type === "outdoor") {
    parts.push("Strava route");
  }

  if (route.zwift_world) {
    parts.push(route.zwift_world);
  }

  if (route.distance_km != null) {
    parts.push(`${route.distance_km} km`);
  }

  if (route.elevation_m != null) {
    parts.push(`${route.elevation_m} m`);
  }

  if (route.duration_min != null) {
    parts.push(`${route.duration_min} min`);
  }

  return parts.join(" · ");
}
