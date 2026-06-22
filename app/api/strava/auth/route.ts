import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { isStravaConfigured, getStravaRedirectUri } from "@/lib/strava/config";
import { buildStravaAuthorizeUrl } from "@/lib/strava/oauth";
import { requireAuthenticatedUser } from "@/lib/strava/session";
import { buildStravaLoginUrl } from "@/lib/strava/urls";
import { getStravaOAuthCookieNames } from "@/lib/strava/start-oauth";

export async function GET(request: Request) {
  const { STATE_COOKIE, RETURN_COOKIE, FLOW_COOKIE } = getStravaOAuthCookieNames();

  if (!isStravaConfigured()) {
    return NextResponse.json(
      {
        error: "Strava OAuth is not configured on this server.",
        redirectUri: getStravaRedirectUri(),
      },
      { status: 503 }
    );
  }

  const auth = await requireAuthenticatedUser();
  if (auth.error === "unauthenticated" || !auth.user) {
    const url = new URL(request.url);
    const returnTo = url.searchParams.get("returnTo") ?? "/outdoor";
    const loginUrl = new URL(buildStravaLoginUrl(returnTo), request.url);
    return NextResponse.redirect(loginUrl);
  }

  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo");
  const safeReturn =
    returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : "/dashboard";

  const state = randomBytes(24).toString("hex");
  const authorizeUrl = buildStravaAuthorizeUrl(state);
  const response = NextResponse.redirect(authorizeUrl);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600,
  };

  response.cookies.set(STATE_COOKIE, state, cookieOptions);
  response.cookies.set(RETURN_COOKIE, safeReturn, cookieOptions);
  response.cookies.set(FLOW_COOKIE, "connect", cookieOptions);

  return response;
}
