import { getSupabaseAdmin } from "@/lib/supabase";
import { isStravaConfigured } from "@/lib/env";

export async function getStravaDatabaseStatus(): Promise<{
  ready: boolean;
  configured: boolean;
  hint: string | null;
}> {
  const configured = isStravaConfigured();

  if (!configured) {
    return {
      ready: false,
      configured: false,
      hint: "Ajoute STRAVA_CLIENT_ID et STRAVA_CLIENT_SECRET dans .env.local",
    };
  }

  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin.from("profiles").select("id").limit(1);

    if (error?.code === "PGRST205") {
      return {
        ready: false,
        configured: true,
        hint: "Exécute supabase/RUN-ME-STRAVA.sql dans Supabase → SQL Editor (table profiles manquante).",
      };
    }

    if (error) {
      return {
        ready: false,
        configured: true,
        hint: error.message,
      };
    }

    return { ready: true, configured: true, hint: null };
  } catch {
    return {
      ready: false,
      configured: true,
      hint: "Impossible de joindre Supabase. Vérifie .env.local.",
    };
  }
}
