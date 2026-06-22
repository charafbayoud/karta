import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { isStravaConfigured } from "@/lib/strava/config";
import { buildStravaAuthorizeUrl } from "@/lib/strava/oauth";

const STATE_COOKIE = "strava_oauth_state";
const RETURN_COOKIE = "strava_oauth_return";
const FLOW_COOKIE = "strava_oauth_flow";

export type StravaOAuthFlow = "signup" | "login" | "connect";

function safeReturnPath(value: string | undefined, fallback: string): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return fallback;
}

export function startStravaOAuth(
  request: Request,
  flow: StravaOAuthFlow,
  defaultReturnTo: string
): NextResponse {
  if (!isStravaConfigured()) {
    return NextResponse.json({ error: "Strava OAuth is not configured." }, { status: 503 });
  }

  const url = new URL(request.url);
  const returnTo = safeReturnPath(url.searchParams.get("returnTo") ?? undefined, defaultReturnTo);
  const state = randomBytes(24).toString("hex");
  const response = NextResponse.redirect(buildStravaAuthorizeUrl(state));

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600,
  };

  response.cookies.set(STATE_COOKIE, state, cookieOptions);
  response.cookies.set(RETURN_COOKIE, returnTo, cookieOptions);
  response.cookies.set(FLOW_COOKIE, flow, cookieOptions);

  return response;
}

export function clearStravaOAuthCookies(response: NextResponse): void {
  response.cookies.delete(STATE_COOKIE);
  response.cookies.delete(RETURN_COOKIE);
  response.cookies.delete(FLOW_COOKIE);
}

export function getStravaOAuthCookieNames() {
  return { STATE_COOKIE, RETURN_COOKIE, FLOW_COOKIE };
}
