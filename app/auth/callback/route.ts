import { NextResponse } from "next/server";
import { upsertProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
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

  if (!profile?.primary_sport || !profile?.primary_experience) {
    return NextResponse.redirect(`${origin}/signup/onboarding`);
  }

  return NextResponse.redirect(`${origin}${next.startsWith("/") ? next : "/dashboard"}`);
}
