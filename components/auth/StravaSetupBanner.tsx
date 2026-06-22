import { getStravaDatabaseStatus } from "@/lib/strava/database-status";

export async function StravaSetupBanner() {
  const status = await getStravaDatabaseStatus();

  if (status.ready) return null;

  return (
    <div className="auth-setup-banner" role="alert">
      <strong>Strava ne peut pas fonctionner tant que la base n&apos;est pas prête.</strong>
      <p>{status.hint}</p>
      <p className="auth-setup-banner-steps">
        1. supabase.com → ton projet → SQL Editor
        <br />
        2. Colle le fichier <code>supabase/RUN-ME-STRAVA.sql</code>
        <br />
        3. Clique Run → recharge cette page
      </p>
    </div>
  );
}
