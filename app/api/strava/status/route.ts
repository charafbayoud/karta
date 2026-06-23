import { NextResponse } from "next/server";
import { getStravaDatabaseStatus } from "@/lib/strava/database-status";
import { isStravaConfigured, getStravaRedirectUri } from "@/lib/strava/config";
import { getValidStravaAccessToken } from "@/lib/strava/tokens";
import { requireAuthenticatedUser } from "@/lib/strava/session";
import { getCurrentProfile } from "@/lib/auth/profile";

export async function GET() {
  const configured = isStravaConfigured();
  const dbStatus = await getStravaDatabaseStatus();
  const databaseReady = dbStatus.ready;
  const databaseHint = dbStatus.hint ?? undefined;

  if (!configured) {
    return NextResponse.json({
      configured: false,
      connected: false,
      databaseReady,
      databaseHint,
      redirectUri: getStravaRedirectUri(),
    });
  }

  const auth = await requireAuthenticatedUser();

  if (auth.error === "unauthenticated" || !auth.user) {
    return NextResponse.json({
      configured: true,
      connected: false,
      authenticated: false,
      databaseReady,
      databaseHint,
      redirectUri: getStravaRedirectUri(),
      message: "Sign in to KARTA before connecting Strava.",
    });
  }

  const profile = await getCurrentProfile();
  const connected = Boolean(profile?.strava_connected);
  let tokenValid = false;

  if (connected) {
    try {
      const token = await getValidStravaAccessToken(auth.user.id);
      tokenValid = Boolean(token);
    } catch (err) {
      console.error("[strava/status] token refresh failed", err);
    }
  }

  return NextResponse.json({
    configured: true,
    connected,
    tokenValid,
    authenticated: true,
    databaseReady,
    databaseHint,
    redirectUri: getStravaRedirectUri(),
  });
}
