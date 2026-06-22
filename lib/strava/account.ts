import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabaseAdmin } from "@/lib/supabase";
import { upsertProfile } from "@/lib/auth/profile";
import type { StravaTokenResponse } from "@/lib/strava/oauth";
import { saveStravaTokens } from "@/lib/strava/tokens";

function stravaEmail(athleteId: number): string {
  return `strava+${athleteId}@users.karta.club`;
}

function athleteName(token: StravaTokenResponse): string | undefined {
  const first = token.athlete?.firstname?.trim();
  const last = token.athlete?.lastname?.trim();
  const full = [first, last].filter(Boolean).join(" ");
  return full || undefined;
}

async function findProfileByAthleteId(athleteId: number) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("profiles")
    .select("id, email, primary_sport, primary_experience")
    .eq("strava_athlete_id", athleteId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function establishSession(email: string): Promise<void> {
  const admin = getSupabaseAdmin();
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkError || !linkData.properties.hashed_token) {
    throw linkError ?? new Error("Unable to create KARTA session.");
  }

  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  const { error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: "email",
  });

  if (verifyError) throw verifyError;
}

export async function signInOrSignUpWithStrava(
  token: StravaTokenResponse,
  mode: "signup" | "login"
): Promise<{ redirectTo: string; isNewUser: boolean }> {
  const athleteId = token.athlete?.id;
  if (!athleteId) {
    throw new Error("Strava did not return an athlete profile.");
  }

  let profile = await findProfileByAthleteId(athleteId);
  const email = profile?.email ?? stravaEmail(athleteId);
  let isNewUser = false;

  if (!profile) {
    if (mode === "login") {
      return { redirectTo: "/login?strava=no_account", isNewUser: false };
    }

    const admin = getSupabaseAdmin();
    const name = athleteName(token);
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        name,
        strava_athlete_id: athleteId,
        auth_provider: "strava",
      },
    });

    if (createError || !created.user) {
      throw createError ?? new Error("Unable to create KARTA account from Strava.");
    }

    await upsertProfile({
      id: created.user.id,
      email,
      name,
    });

    profile = {
      id: created.user.id,
      email,
      primary_sport: null,
      primary_experience: null,
    };
    isNewUser = true;
  }

  await saveStravaTokens(profile.id, token, athleteId);
  await establishSession(email);

  if (!profile.primary_sport || !profile.primary_experience) {
    return { redirectTo: "/signup/onboarding", isNewUser };
  }

  return {
    redirectTo: isNewUser ? "/dashboard?strava=connected" : "/dashboard",
    isNewUser,
  };
}
