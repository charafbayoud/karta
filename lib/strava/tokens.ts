import { getSupabaseAdmin } from "@/lib/supabase";
import { refreshStravaToken, type StravaTokenResponse } from "@/lib/strava/oauth";

type StravaTokenRow = {
  strava_access_token: string | null;
  strava_refresh_token: string | null;
  strava_token_expires_at: string | null;
  strava_connected: boolean;
};

function expiresAtFromToken(token: StravaTokenResponse): string {
  return new Date(token.expires_at * 1000).toISOString();
}

export async function saveStravaTokens(
  userId: string,
  token: StravaTokenResponse,
  athleteId?: number
): Promise<void> {
  const admin = getSupabaseAdmin();
  const payload: Record<string, unknown> = {
    strava_connected: true,
    strava_access_token: token.access_token,
    strava_refresh_token: token.refresh_token,
    strava_token_expires_at: expiresAtFromToken(token),
  };

  if (athleteId) {
    payload.strava_athlete_id = athleteId;
  }

  const { error } = await admin.from("profiles").update(payload).eq("id", userId);

  if (error) throw error;
}

export async function disconnectStrava(userId: string): Promise<void> {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("profiles")
    .update({
      strava_connected: false,
      strava_access_token: null,
      strava_refresh_token: null,
      strava_token_expires_at: null,
      strava_athlete_id: null,
    })
    .eq("id", userId);

  if (error) throw error;
}

async function getStravaTokenRow(userId: string): Promise<StravaTokenRow | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("profiles")
    .select(
      "strava_connected, strava_access_token, strava_refresh_token, strava_token_expires_at"
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as StravaTokenRow | null;
}

function isExpired(expiresAt: string | null, bufferSeconds = 120): boolean {
  if (!expiresAt) return true;
  const expiryMs = new Date(expiresAt).getTime();
  return Date.now() >= expiryMs - bufferSeconds * 1000;
}

let cachedServiceToken: { access: string; expiresAtMs: number } | null = null;

/** Optional server token so segment explore works for all logged-in users. */
export async function getServiceStravaAccessToken(): Promise<string | null> {
  const refresh = process.env.STRAVA_SERVICE_REFRESH_TOKEN?.trim();
  if (!refresh) return null;

  if (
    cachedServiceToken &&
    Date.now() < cachedServiceToken.expiresAtMs - 120_000
  ) {
    return cachedServiceToken.access;
  }

  const refreshed = await refreshStravaToken(refresh);
  cachedServiceToken = {
    access: refreshed.access_token,
    expiresAtMs: refreshed.expires_at * 1000,
  };
  return refreshed.access_token;
}

/** User token first, then optional service token for segment explore. */
export async function getStravaExploreAccessToken(userId: string): Promise<string | null> {
  const userToken = await getValidStravaAccessToken(userId);
  if (userToken) return userToken;
  return getServiceStravaAccessToken();
}

/** Returns a valid access token, refreshing when needed. Server-only. */
export async function getValidStravaAccessToken(userId: string): Promise<string | null> {
  const row = await getStravaTokenRow(userId);
  if (!row?.strava_connected || !row.strava_access_token) {
    return null;
  }

  if (!isExpired(row.strava_token_expires_at) || !row.strava_refresh_token) {
    return row.strava_access_token;
  }

  const refreshed = await refreshStravaToken(row.strava_refresh_token);
  await saveStravaTokens(userId, refreshed);
  return refreshed.access_token;
}
