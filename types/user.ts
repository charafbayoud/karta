export type PrimarySport = "cycling" | "running" | "walking";
export type PrimaryExperience = "indoor" | "outdoor" | "both";
export type SavedRouteType = "indoor" | "outdoor" | "gps-art";

export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  primary_sport: PrimarySport | null;
  primary_experience: PrimaryExperience | null;
  strava_connected: boolean;
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
