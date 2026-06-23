import Link from "next/link";
import {
  getStravaDatabaseStatus,
  SUPABASE_SQL_EDITOR_URL,
} from "@/lib/strava/database-status";

export async function StravaSetupBanner() {
  const status = await getStravaDatabaseStatus();

  if (status.ready) return null;

  return (
    <div className="auth-setup-banner" role="alert">
      <strong>Strava n&apos;est pas encore prêt sur ce serveur.</strong>
      {status.hint ? <p>{status.hint}</p> : null}
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
          1.{" "}
          <Link href="/setup/strava-sql">Ouvre la page SQL KARTA</Link> → copie tout le script
          <br />
          2.{" "}
          <a href={SUPABASE_SQL_EDITOR_URL} target="_blank" rel="noopener noreferrer">
            Colle dans Supabase → SQL Editor
          </a>{" "}
          → clique <strong>Run</strong>
          <br />
          3. Recharge cette page (ne clique pas sur <code>supabase/RUN-ME-STRAVA.sql</code> — ce
          n&apos;est pas une URL web)
        </p>
      )}
    </div>
  );
}
