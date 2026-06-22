import Link from "next/link";
import {
  ConnectStravaButton,
  DisconnectStravaButton,
} from "@/components/dashboard/StravaConnect";
import { getCurrentProfile } from "@/lib/auth/profile";
import { isDevAuthBypass, isStravaConfigured } from "@/lib/env";
import { getStravaRedirectUri } from "@/lib/strava/config";
import { buildStravaLoginUrl } from "@/lib/strava/urls";
import { createClient } from "@/lib/supabase/server";

type StravaConnectPanelProps = {
  returnTo?: string;
  compact?: boolean;
};

export async function StravaConnectPanel({
  returnTo = "/outdoor",
  compact = false,
}: StravaConnectPanelProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getCurrentProfile() : null;
  const stravaReady = isStravaConfigured();
  const connected = Boolean(profile?.strava_connected);
  const redirectUri = getStravaRedirectUri();
  const devBypass = isDevAuthBypass();

  return (
    <section
      className={`dashboard-banner ${connected ? "dashboard-banner--success" : ""} ${
        compact ? "dashboard-banner--compact" : ""
      }`}
    >
      {connected ? (
        <>
          <div>
            <h2>Strava connecté</h2>
            <p>Ton compte Strava est lié à KARTA.</p>
          </div>
          <DisconnectStravaButton label="Déconnecter" />
        </>
      ) : (
        <>
          <div>
            <h2>Connecter Strava</h2>
            {devBypass && !user && (
              <p className="dashboard-notice dashboard-notice--warn" role="status">
                Mode test actif : connecte-toi à KARTA pour lier Strava (le bypass ne suffit pas).
              </p>
            )}
            {!user ? (
              <p>
                Étape 1 — connecte-toi à KARTA. Étape 2 — autorise Strava sur leur site.
              </p>
            ) : !stravaReady ? (
              <p>Strava n&apos;est pas configuré sur ce serveur.</p>
            ) : (
              <>
                <p>
                  Clique sur le bouton orange — tu seras redirigé vers le site Strava pour
                  autoriser KARTA.
                </p>
                <p className="dashboard-hint">
                  Callback Strava (à configurer sur strava.com/settings/api) :{" "}
                  <code>{redirectUri}</code>
                </p>
              </>
            )}
          </div>
          {!user ? (
            <Link href={buildStravaLoginUrl(returnTo)} className="btn-primary">
              Se connecter pour lier Strava
            </Link>
          ) : stravaReady ? (
            <ConnectStravaButton returnTo={returnTo} label="Connecter Strava" />
          ) : (
            <button type="button" className="btn-secondary" disabled>
              Connecter Strava
            </button>
          )}
        </>
      )}
    </section>
  );
}
