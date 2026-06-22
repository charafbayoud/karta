export function buildStravaAuthPath(returnTo = "/outdoor"): string {
  const safeReturn =
    returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/outdoor";
  return `/api/strava/auth?returnTo=${encodeURIComponent(safeReturn)}`;
}

export function buildStravaLoginUrl(returnTo = "/outdoor"): string {
  const next = encodeURIComponent(buildStravaAuthPath(returnTo));
  return `/login?next=${next}&reason=strava`;
}
