import Link from "next/link";
import {
  getStravaDatabaseStatus,
  SUPABASE_API_URL,
  SUPABASE_SQL_EDITOR_URL,
} from "@/lib/strava/database-status";

export async function StravaSetupBanner() {
  const status = await getStravaDatabaseStatus();

  if (status.ready) return null;

  return (
    <div className="auth-setup-banner" role="alert">
      <strong>Strava n&apos;est pas encore prêt sur ce serveur.</strong>
      {status.hint ? <p>{status.hint}</p> : null}

      {status.issue === "strava" && (
        <p className="auth-setup-banner-steps">
          1. Va sur{" "}
          <a href="https://www.strava.com/settings/api" target="_blank" rel="noopener noreferrer">
            strava.com/settings/api
          </a>
          <br />
          2. Ajoute STRAVA_CLIENT_ID et STRAVA_CLIENT_SECRET sur Vercel
          <br />
          3. Redeploy
        </p>
      )}

      {status.issue === "env" && (
        <p className="auth-setup-banner-steps">
          1.{" "}
          <a href={SUPABASE_API_URL} target="_blank" rel="noopener noreferrer">
            Ouvre Supabase, API
          </a>
          <br />
          2. Sur Vercel, recopie <code>SUPABASE_SERVICE_ROLE_KEY</code> (service_role, eyJ...)
          <br />
          3. Verifie aussi <code>NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> → Redeploy
        </p>
      )}

      {status.issue === "sql" && (
        <p className="auth-setup-banner-steps">
          1.{" "}
          <Link href="/setup/strava-sql">Ouvre la page SQL KARTA</Link> → copie le script
          <br />
          2.{" "}
          <a href={SUPABASE_SQL_EDITOR_URL} target="_blank" rel="noopener noreferrer">
            Colle dans Supabase, SQL Editor
          </a>{" "}
          → Run
          <br />
          3. Recharge cette page
        </p>
      )}
    </div>
  );
}
