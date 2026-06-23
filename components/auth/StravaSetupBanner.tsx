import { getStravaDatabaseStatus } from "@/lib/strava/database-status";

export async function StravaSetupBanner() {
  const status = await getStravaDatabaseStatus();

  if (status.ready) return null;

  return (
    <div className="auth-setup-banner" role="alert">
      <strong>Strava n&apos;est pas encore prêt sur ce serveur.</strong>
      <p>{status.hint}</p>
      {!status.configured ? (
        <p className="auth-setup-banner-steps">
          1. Va sur{" "}
          <a href="https://www.strava.com/settings/api" target="_blank" rel="noopener noreferrer">
            strava.com/settings/api
          </a>{" "}
          → copie Client ID et Client Secret
          <br />
          2. Ajoute-les dans <code>.env.local</code> (local) ou Vercel → Environment Variables
          (production)
          <br />
          3. Redémarre le serveur (<code>npm run dev</code>) ou redeploy sur Vercel
        </p>
      ) : (
        <p className="auth-setup-banner-steps">
          1. supabase.com → ton projet → SQL Editor
          <br />
          2. Colle le fichier <code>supabase/RUN-ME-STRAVA.sql</code>
          <br />
          3. Clique Run → recharge cette page
        </p>
      )}
    </div>
  );
}
