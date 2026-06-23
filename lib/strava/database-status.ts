import { getSupabaseAdmin } from "@/lib/supabase";
import { isStravaConfigured } from "@/lib/env";
import { validateSupabaseEnvForServer } from "@/lib/supabase/env";

const SUPABASE_SQL_EDITOR_URL =
  "https://supabase.com/dashboard/project/wbgztmysocsxdaysbrsp/sql/new";

export { SUPABASE_SQL_EDITOR_URL };

function formatCaughtError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("ByteString") || message.includes("8594")) {
    return (
      "Cle Supabase invalide sur Vercel (caractere special detecte, souvent une fleche). " +
      "Ouvre Vercel, Environment Variables, et recopie uniquement les cles eyJ... depuis Supabase, API."
    );
  }

  if (message.includes("<!DOCTYPE html") || message.includes("<html")) {
    return (
      "Connexion Supabase incorrecte. Verifie NEXT_PUBLIC_SUPABASE_URL " +
      "(https://wbgztmysocsxdaysbrsp.supabase.co) sur Vercel."
    );
  }

  if (message.length > 240) {
    return `${message.slice(0, 240)}…`;
  }

  return message;
}

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

  const envIssue = validateSupabaseEnvForServer();
  if (envIssue) {
    return {
      ready: false,
      configured: true,
      hint: envIssue.message,
    };
  }

  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin.from("profiles").select("id").limit(1);

    if (error?.code === "PGRST205" || error?.code === "42P01") {
      return {
        ready: false,
        configured: true,
        hint: "La table profiles n'existe pas encore. Ouvre /setup/strava-sql, copie le SQL, execute-le dans Supabase.",
      };
    }

    if (error) {
      return {
        ready: false,
        configured: true,
        hint: `Erreur Supabase (${error.code ?? "unknown"}) : ${error.message}`,
      };
    }

    return { ready: true, configured: true, hint: null };
  } catch (error) {
    return {
      ready: false,
      configured: true,
      hint: formatCaughtError(error),
    };
  }
}
