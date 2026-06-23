import Link from "next/link";
import {
  ConnectStravaButton,
  DisconnectStravaButton,
} from "@/components/dashboard/StravaConnect";
import { getCurrentProfile } from "@/lib/auth/profile";
import { isDevAuthBypass, isStravaConfigured } from "@/lib/env";
import { buildStravaLoginUrl } from "@/lib/strava/urls";
import { hasStravaAccess } from "@/lib/strava/linked";
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
  const connected = user ? await hasStravaAccess(user.id, profile, user) : false;
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
            <h2>Lier Strava pour Outdoor</h2>
            {devBypass && !user && (
              <p className="dashboard-notice dashboard-notice--warn" role="status">
                Mode test actif : connecte-toi à KARTA pour lier Strava (le bypass ne suffit pas).
              </p>
            )}
            {!user ? (
              <p>
                Connecte-toi à KARTA, puis autorise Strava — une seule fois suffit pour Outdoor.
              </p>
            ) : !stravaReady ? (
              <p>Strava n&apos;est pas configuré sur ce serveur.</p>
            ) : (
              <p>
                Tu es connecté à KARTA. Outdoor utilise tes segments Strava — clique ci-dessous
                pour autoriser Strava <strong>une seule fois</strong>. Tu n&apos;auras plus à le
                refaire ensuite.
              </p>
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
