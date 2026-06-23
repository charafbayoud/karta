import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function trimEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

function isLatin1(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) > 255) return false;
  }
  return true;
}

function readSupabaseConfig(): { url: string; key: string } | null {
  const url = trimEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = trimEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !key) return null;
  if (!url.includes(".supabase.co")) return null;
  if (!isLatin1(url) || !isLatin1(key)) return null;
  if (!key.startsWith("eyJ")) return null;

  return { url, key };
}

function applySessionCookies(
  response: NextResponse,
  cookiesToSet: { name: string; value: string; options: CookieOptions }[]
) {
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
  return response;
}

/** Keep auth cookies on one canonical host (matches Vercel www redirect). */
function canonicalHostRedirect(request: NextRequest): NextResponse | null {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();

  if (process.env.NODE_ENV !== "production" || !host || host === "www.karta.club") {
    return null;
  }

  if (host === "karta.club") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = "www.karta.club";
    return NextResponse.redirect(url, 308);
  }

  return null;
}

export async function updateSession(request: NextRequest) {
  try {
    const canonical = canonicalHostRedirect(request);
    if (canonical) return canonical;

    let supabaseResponse = NextResponse.next({ request });
    let pendingCookies: { name: string; value: string; options: CookieOptions }[] = [];

    const devBypass =
      process.env.NODE_ENV === "development" &&
      process.env.KARTA_DEV_BYPASS_AUTH === "true";

    const protectedPrefixes = ["/dashboard", "/my-routes", "/signup/onboarding"];
    const isProtected = protectedPrefixes.some((prefix) =>
      request.nextUrl.pathname.startsWith(prefix)
    );

    if (devBypass && isProtected) {
      return supabaseResponse;
    }

    const config = readSupabaseConfig();
    if (!config) {
      return supabaseResponse;
    }

    const supabase = createServerClient(config.url, config.key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          pendingCookies = cookiesToSet;
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          applySessionCookies(supabaseResponse, cookiesToSet);
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isProtected && !user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", request.nextUrl.pathname);
      return applySessionCookies(NextResponse.redirect(loginUrl), pendingCookies);
    }

    if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
      const next = request.nextUrl.searchParams.get("next");
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = next?.startsWith("/") ? next : "/dashboard";
      redirectUrl.search = "";
      return applySessionCookies(NextResponse.redirect(redirectUrl), pendingCookies);
    }

    return supabaseResponse;
  } catch {
    return NextResponse.next({ request });
  }
}
