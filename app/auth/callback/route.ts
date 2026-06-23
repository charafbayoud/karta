import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { upsertProfile } from "@/lib/auth/profile";

export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl;
  const code = requestUrl.searchParams.get("code");
  const nextParam = requestUrl.searchParams.get("next") ?? "/dashboard";
  const safeNext = nextParam.startsWith("/") ? nextParam : "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=auth`);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=auth`);
  }

  const cookieStore = await cookies();
  const pendingCookies: { name: string; value: string; options: CookieOptions }[] = [];

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        pendingCookies.push(...cookiesToSet);
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Response will carry cookies below.
          }
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("OAuth exchangeCodeForSession failed:", error.message);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=auth`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=auth`);
  }

  const name =
    (user.user_metadata?.name as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined);

  try {
    await upsertProfile({
      id: user.id,
      email: user.email,
      name,
    });
  } catch (profileError) {
    console.error("OAuth profile upsert failed:", profileError);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("primary_sport, primary_experience")
    .eq("id", user.id)
    .maybeSingle();

  const redirectPath =
    !profile?.primary_sport || !profile?.primary_experience
      ? "/signup/onboarding"
      : safeNext;

  const forwardedHost = request.headers.get("x-forwarded-host");
  const redirectOrigin =
    process.env.NODE_ENV === "production" && forwardedHost
      ? `https://${forwardedHost}`
      : requestUrl.origin;

  const response = NextResponse.redirect(`${redirectOrigin}${redirectPath}`);

  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
