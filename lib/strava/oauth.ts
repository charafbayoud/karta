import {
  getStravaClientId,
  getStravaClientSecret,
  getStravaRedirectUri,
  STRAVA_AUTH_URL,
  STRAVA_SCOPES,
  STRAVA_TOKEN_URL,
} from "@/lib/strava/config";

export type StravaTokenResponse = {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  athlete?: {
    id: number;
    firstname?: string;
    lastname?: string;
  };
};

export function buildStravaAuthorizeUrl(state: string): string {
  const clientId = getStravaClientId();
  if (!clientId) {
    throw new Error("STRAVA_CLIENT_ID is not configured.");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getStravaRedirectUri(),
    response_type: "code",
    approval_prompt: "auto",
    scope: STRAVA_SCOPES,
    state,
  });

  return `${STRAVA_AUTH_URL}?${params.toString()}`;
}

export async function exchangeStravaCode(code: string): Promise<StravaTokenResponse> {
  const clientId = getStravaClientId();
  const clientSecret = getStravaClientSecret();
  if (!clientId || !clientSecret) {
    throw new Error("Strava OAuth is not configured.");
  }

  const response = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Strava token exchange failed (${response.status}): ${detail}`);
  }

  return (await response.json()) as StravaTokenResponse;
}

export async function refreshStravaToken(refreshToken: string): Promise<StravaTokenResponse> {
  const clientId = getStravaClientId();
  const clientSecret = getStravaClientSecret();
  if (!clientId || !clientSecret) {
    throw new Error("Strava OAuth is not configured.");
  }

  const response = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Strava token refresh failed (${response.status}): ${detail}`);
  }

  return (await response.json()) as StravaTokenResponse;
}
