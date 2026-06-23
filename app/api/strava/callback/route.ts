import { type NextRequest, NextResponse } from "next/server";
import {
  establishSessionOnResponse,
  signInOrSignUpWithStrava,
} from "@/lib/strava/account";
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

function redirectWithMessage(
  request: NextRequest,
  path: string,
  message?: string
): NextResponse {
  const url = new URL(path, request.url);
  if (message) url.searchParams.set("strava", message);
  const response = NextResponse.redirect(url);
  clearStravaOAuthCookies(response);
  return response;
}

async function finishStravaAuthRedirect(
  request: NextRequest,
  path: string,
  email: string,
  message?: string
): Promise<NextResponse> {
  const response = redirectWithMessage(request, path, message);
  await establishSessionOnResponse(request, response, email);
  return response;
}

export async function GET(request: NextRequest) {
  const cookieStore = request.cookies;
  const { STATE_COOKIE, RETURN_COOKIE, FLOW_COOKIE } = getStravaOAuthCookieNames();
  const returnTo = safeReturnPath(cookieStore.get(RETURN_COOKIE)?.value);
  const flow = (cookieStore.get(FLOW_COOKIE)?.value ?? "connect") as StravaOAuthFlow;

  const url = request.nextUrl;
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
      if (result.redirectTo.includes("no_account")) {
        return redirectWithMessage(request, result.redirectTo);
      }
      return finishStravaAuthRedirect(
        request,
        result.redirectTo,
        result.email,
        "connected"
      );
    }

    if (flow === "login") {
      const result = await signInOrSignUpWithStrava(token, "login");
      if (result.redirectTo.includes("no_account")) {
        return redirectWithMessage(request, result.redirectTo);
      }
      return finishStravaAuthRedirect(
        request,
        result.redirectTo,
        result.email,
        "connected"
      );
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
