export function savedRouteErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Impossible de sauvegarder cette route.";
  }

  const record = error as { code?: string; message?: string };

  if (record.code === "PGRST205") {
    if (record.message?.includes("saved_routes")) {
      return "Table saved_routes manquante. Exécute supabase/RUN-ME-STRAVA.sql dans Supabase → SQL Editor.";
    }
    if (record.message?.includes("profiles")) {
      return "Table profiles manquante. Exécute supabase/RUN-ME-STRAVA.sql dans Supabase → SQL Editor.";
    }
  }

  if (record.code === "23503") {
    return "Profil introuvable. Reconnecte-toi ou termine l'inscription.";
  }

  return "Impossible de sauvegarder cette route.";
}
