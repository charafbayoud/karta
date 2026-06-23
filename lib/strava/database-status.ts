import { getSupabaseAdmin } from "@/lib/supabase";
import { isStravaConfigured } from "@/lib/env";
import {
  isLikelySupabaseJwt,
  readSupabaseServiceRoleKey,
  validateSupabaseEnvForServer,
} from "@/lib/supabase/env";

const SUPABASE_SQL_EDITOR_URL =
  "https://supabase.com/dashboard/project/wbgztmysocsxdaysbrsp/sql/new";

const SUPABASE_API_URL =
  "https://supabase.com/dashboard/project/wbgztmysocsxdaysbrsp/settings/api";

export { SUPABASE_SQL_EDITOR_URL, SUPABASE_API_URL };

export type StravaDatabaseIssue = "env" | "sql" | "strava" | null;

export async function getStravaDatabaseStatus(): Promise<{
  ready: boolean;
  configured: boolean;
  hint: string | null;
  issue: StravaDatabaseIssue;
}> {
  const configured = isStravaConfigured();

  if (!configured) {
    return {
      ready: false,
      configured: false,
      hint: "Ajoute STRAVA_CLIENT_ID et STRAVA_CLIENT_SECRET sur Vercel.",
      issue: "strava",
    };
  }

  const serviceRoleKey = readSupabaseServiceRoleKey();
  if (serviceRoleKey && !isLikelySupabaseJwt(serviceRoleKey)) {
    return {
      ready: false,
      configured: true,
      hint:
        "SUPABASE_SERVICE_ROLE_KEY est invalide sur Vercel. Recopie la cle service_role (eyJ...) depuis Supabase, API.",
      issue: "env",
    };
  }

  const envIssue = validateSupabaseEnvForServer();
  if (envIssue) {
    return {
      ready: false,
      configured: true,
      hint: envIssue.message,
      issue: "env",
    };
  }

  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin.from("profiles").select("id").limit(1);

    if (error?.code === "PGRST205" || error?.code === "42P01") {
      return {
        ready: false,
        configured: true,
        hint: "La table profiles n'existe pas encore dans Supabase.",
        issue: "sql",
      };
    }

    if (error?.message?.includes("Invalid API key")) {
      return {
        ready: false,
        configured: true,
        hint:
          "Cle Supabase invalide sur Vercel. Recopie SUPABASE_SERVICE_ROLE_KEY depuis Supabase, API, onglet service_role.",
        issue: "env",
      };
    }

    if (error) {
      return {
        ready: false,
        configured: true,
        hint: `Erreur Supabase : ${error.message}`,
        issue: "env",
      };
    }

    return { ready: true, configured: true, hint: null, issue: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    return {
      ready: false,
      configured: true,
      hint: message.includes("Invalid API key")
        ? "Cle Supabase invalide sur Vercel. Recopie SUPABASE_SERVICE_ROLE_KEY (eyJ...) depuis Supabase, API."
        : message,
      issue: "env",
    };
  }
}
