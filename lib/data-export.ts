import { getSupabaseAdmin } from "@/lib/supabase";
import type { Profile, SavedRoute } from "@/types/user";

export type UserDataExport = {
  exported_at: string;
  profile: Omit<Profile, never> | null;
  saved_routes: Array<
    Omit<SavedRoute, "gpx_data"> & {
      gpx_data_included: boolean;
      gpx_data: string | null;
    }
  >;
  subscription_history: Array<Record<string, unknown>>;
};

function sanitizeProfile(profile: Profile): Profile {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    avatar_url: profile.avatar_url,
    primary_sport: profile.primary_sport,
    primary_experience: profile.primary_experience,
    strava_connected: profile.strava_connected,
    strava_athlete_id: profile.strava_athlete_id ?? null,
    created_at: profile.created_at,
  };
}

export async function exportUserData(userId: string): Promise<UserDataExport | null> {
  const admin = getSupabaseAdmin();

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    console.error("[data-export] profile:", profileError);
    return null;
  }

  const { data: routes, error: routesError } = await admin
    .from("saved_routes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (routesError) {
    console.error("[data-export] saved_routes:", routesError);
    return null;
  }

  return {
    exported_at: new Date().toISOString(),
    profile: profile ? sanitizeProfile(profile as Profile) : null,
    saved_routes: (routes ?? []).map((route) => ({
      ...(route as SavedRoute),
      gpx_data_included: Boolean((route as SavedRoute).gpx_data),
    })),
    subscription_history: [],
  };
}

export function buildExportFilename(date = new Date()): string {
  const stamp = date.toISOString().slice(0, 10);
  return `karta-data-export-${stamp}.json`;
}
