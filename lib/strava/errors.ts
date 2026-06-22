export function getStravaErrorCode(error: unknown): string {
  if (!error || typeof error !== "object") return "error";

  const record = error as { code?: string; message?: string };

  if (record.code === "PGRST205" && record.message?.includes("profiles")) {
    return "db_setup";
  }

  if (record.message?.includes("strava_athlete_id")) {
    return "db_migration";
  }

  return "error";
}

export function stravaErrorMessage(code: string | null | undefined): string | null {
  switch (code) {
    case "connected":
      return "Strava connecté avec succès.";
    case "denied":
      return "Autorisation Strava annulée.";
    case "invalid_state":
      return "Connexion Strava expirée — réessaie.";
    case "db_setup":
      return "Base de données non configurée. Exécute supabase/03-v2-profiles.sql puis 04-strava-athlete-id.sql dans Supabase → SQL Editor.";
    case "db_migration":
      return "Colonne Strava manquante. Exécute supabase/04-strava-athlete-id.sql dans Supabase → SQL Editor.";
    case "error":
      return "Impossible de finaliser la connexion Strava. Vérifie le callback « localhost » sur strava.com/settings/api.";
    case "login_required":
      return "Connecte-toi à KARTA avant de lier Strava.";
    case "no_account":
      return "Aucun compte KARTA avec ce Strava. Utilise « S'inscrire avec Strava ».";
    default:
      return null;
  }
}
