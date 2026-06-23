import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/user";
import { getValidStravaAccessToken } from "@/lib/strava/tokens";

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

export async function hasStravaAccess(
  userId: string,
  profile: Profile | null,
  user?: User | null
): Promise<boolean> {
  if (isStravaLinked(profile, user)) return true;

  try {
    const token = await getValidStravaAccessToken(userId);
    return Boolean(token);
  } catch {
    return false;
  }
}
