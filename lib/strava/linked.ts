import type { Profile } from "@/types/user";

type StravaUserMetadata = {
  strava_athlete_id?: number;
  auth_provider?: string;
};

export function isStravaLinked(
  profile: Profile | null,
  user?: { user_metadata?: StravaUserMetadata | null } | null
): boolean {
  return Boolean(
    profile?.strava_connected ||
      profile?.strava_athlete_id ||
      user?.user_metadata?.strava_athlete_id ||
      user?.user_metadata?.auth_provider === "strava"
  );
}
