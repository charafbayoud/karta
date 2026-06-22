import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ConnectStravaButton } from "@/components/dashboard/StravaConnect";
import { stravaErrorMessage } from "@/lib/strava/errors";
import { getCurrentProfile } from "@/lib/auth/profile";
import { isStravaConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

type SignupStravaPageProps = {
  searchParams: Promise<{ strava?: string }>;
};

export default async function SignupStravaPage({ searchParams }: SignupStravaPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/signup/strava&reason=strava");
  }

  const profile = await getCurrentProfile();
  if (profile?.strava_connected) {
    redirect("/dashboard?strava=connected");
  }

  const params = await searchParams;
  const stravaMessage = stravaErrorMessage(params.strava);
  const stravaReady = isStravaConfigured();

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="auth-card">
          <p className="karta-label">Étape 4 sur 4</p>
          <h1>Connecter Strava</h1>
          <p className="auth-sub">
            Optionnel — lie ton compte pour importer tes segments Strava et générer des boucles près
            de chez toi.
          </p>

          {stravaMessage && (
            <p className="dashboard-notice" role="status">
              {stravaMessage}
            </p>
          )}

          <ul className="auth-feature-list">
            <li>Trouver des segments populaires près de chez toi</li>
            <li>Générer des boucles GPS sur les vraies routes</li>
            <li>Exporter le GPX pour Garmin ou Wahoo</li>
          </ul>

          {stravaReady ? (
            <ConnectStravaButton
              returnTo="/signup/strava"
              label="Connecter Strava"
              className="btn-primary auth-submit"
            />
          ) : (
            <p className="outdoor-hint">Strava n&apos;est pas configuré sur ce serveur.</p>
          )}

          <Link href="/dashboard" className="btn-secondary auth-submit auth-skip-link">
            Plus tard
          </Link>

          <p className="auth-switch">
            Tu pourras connecter Strava à tout moment depuis Outdoor ou le Dashboard.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
