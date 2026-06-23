import { NextResponse, type NextRequest } from "next/server";

/**
 * Keep middleware minimal so bad Supabase env on Vercel cannot take the site offline.
 * Auth redirects run in page/layout server components instead.
 */
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

export function middleware(request: NextRequest) {
  try {
    const canonical = canonicalHostRedirect(request);
    if (canonical) return canonical;
  } catch {
    // Ignore redirect errors — serve the page anyway.
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
