import { getAppUrl } from "@/lib/env";

export const STRAVA_AUTH_URL = "https://www.strava.com/oauth/authorize";
export const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
export const STRAVA_API_BASE = "https://www.strava.com/api/v3";

/** Scopes: profile, segments, upload GPS Art activities. */
export const STRAVA_SCOPES = ["read", "activity:read", "activity:write"].join(",");

export function getStravaClientId(): string | null {
  const id = process.env.STRAVA_CLIENT_ID?.trim();
  return id && id.length > 0 ? id : null;
}

export function getStravaClientSecret(): string | null {
  const secret = process.env.STRAVA_CLIENT_SECRET?.trim();
  return secret && secret.length > 0 ? secret : null;
}

export function getStravaRedirectUri(): string {
  return `${getAppUrl()}/api/strava/callback`;
}

export function isStravaConfigured(): boolean {
  return Boolean(getStravaClientId() && getStravaClientSecret());
}
