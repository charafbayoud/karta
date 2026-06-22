import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signInOrSignUpWithStrava } from "@/lib/strava/account";
import { exchangeStravaCode } from "@/lib/strava/oauth";
import { requireAuthenticatedUser } from "@/lib/strava/session";
import {
  clearStravaOAuthCookies,
  getStravaOAuthCookieNames,
  type StravaOAuthFlow,
} from "@/lib/strava/start-oauth";
import { saveStravaTokens } from "@/lib/strava/tokens";
import { getStravaErrorCode } from "@/lib/strava/errors";

function safeReturnPath(value: string | undefined): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/dashboard";
}

function redirectWithMessage(request: Request, path: string, message?: string) {
  const url = new URL(path, request.url);
  if (message) url.searchParams.set("strava", message);
  const response = NextResponse.redirect(url);
  clearStravaOAuthCookies(response);
  return response;
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const { STATE_COOKIE, RETURN_COOKIE, FLOW_COOKIE } = getStravaOAuthCookieNames();
  const returnTo = safeReturnPath(cookieStore.get(RETURN_COOKIE)?.value);
  const flow = (cookieStore.get(FLOW_COOKIE)?.value ?? "connect") as StravaOAuthFlow;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stravaError = url.searchParams.get("error");
  const expectedState = cookieStore.get(STATE_COOKIE)?.value;

  if (stravaError) {
    const fallback = flow === "login" ? "/login" : flow === "signup" ? "/signup" : returnTo;
    return redirectWithMessage(request, fallback, "denied");
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    const fallback = flow === "login" ? "/login" : flow === "signup" ? "/signup" : returnTo;
    return redirectWithMessage(request, fallback, "invalid_state");
  }

  try {
    const token = await exchangeStravaCode(code);

    if (flow === "signup") {
      const result = await signInOrSignUpWithStrava(token, "signup");
      return redirectWithMessage(
        request,
        result.redirectTo,
        result.isNewUser ? "connected" : "connected"
      );
    }

    if (flow === "login") {
      const result = await signInOrSignUpWithStrava(token, "login");
      if (result.redirectTo.includes("no_account")) {
        return redirectWithMessage(request, result.redirectTo);
      }
      return redirectWithMessage(request, result.redirectTo, "connected");
    }

    const auth = await requireAuthenticatedUser();
    if (auth.error || !auth.user) {
      return redirectWithMessage(request, "/login?reason=strava", "login_required");
    }

    await saveStravaTokens(auth.user.id, token, token.athlete?.id);
    return redirectWithMessage(request, returnTo, "connected");
  } catch (err) {
    console.error("[strava/callback]", err);
    const fallback = flow === "login" ? "/login" : flow === "signup" ? "/signup" : returnTo;
    return redirectWithMessage(request, fallback, getStravaErrorCode(err));
  }
}
