export type PrimarySport = "cycling" | "running" | "walking";
export type PrimaryExperience = "indoor" | "outdoor" | "both";
export type SavedRouteType = "indoor" | "outdoor" | "gps-art";

export interface SavedRoute {
  id: string;
  user_id: string;
  route_name: string;
  type: SavedRouteType;
  sport: PrimarySport | null;
  distance_km: number | null;
  elevation_m: number | null;
  duration_min: number | null;
  gpx_data: string | null;
  map_preview_url: string | null;
  shape_type: string | null;
  zwift_world: string | null;
  created_at: string;
}

export const SAVED_ROUTE_TYPE_LABELS: Record<SavedRouteType, string> = {
  indoor: "Ride Indoor",
  outdoor: "Route Generator",
  "gps-art": "GPS Art",
};

export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  primary_sport: PrimarySport | null;
  primary_experience: PrimaryExperience | null;
  strava_connected: boolean;
  strava_athlete_id?: number | null;
  created_at: string;
}

export const PRIMARY_SPORT_LABELS: Record<PrimarySport, string> = {
  cycling: "Cycling",
  running: "Running",
  walking: "Walking",
};

export const PRIMARY_EXPERIENCE_LABELS: Record<PrimaryExperience, string> = {
  indoor: "Ride Indoor",
  outdoor: "Ride Outdoor",
  both: "Both",
};
