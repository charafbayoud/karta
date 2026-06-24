import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { upsertProfile } from "@/lib/auth/profile";

export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl;
  const code = requestUrl.searchParams.get("code");
  const nextParam = requestUrl.searchParams.get("next") ?? "/dashboard";
  const safeNext = nextParam.startsWith("/") ? nextParam : "/dashboard";

  const forwardedHost = request.headers.get("x-forwarded-host");
  const redirectOrigin =
    process.env.NODE_ENV === "production" && forwardedHost
      ? `https://${forwardedHost.split(",")[0]?.trim()}`
      : requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${redirectOrigin}/login?error=auth`);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.redirect(`${redirectOrigin}/login?error=auth`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("OAuth exchangeCodeForSession failed:", error.message);
    return NextResponse.redirect(`${redirectOrigin}/login?error=auth&reason=exchange`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.redirect(`${redirectOrigin}/login?error=auth&reason=no-user`);
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
    safeNext === "/reset-password"
      ? safeNext
      : !profile?.primary_sport || !profile?.primary_experience
        ? "/signup/onboarding"
        : safeNext;

  return NextResponse.redirect(`${redirectOrigin}${redirectPath}`);
}
