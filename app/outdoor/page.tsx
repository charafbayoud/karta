import { DashboardShell } from "@/components/layout/DashboardShell";
import { StravaConnectPanel } from "@/components/dashboard/StravaConnectPanel";
import { RouteGeneratorWizard } from "@/components/outdoor/RouteGeneratorWizard";
import { getCurrentProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

export default async function OutdoorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getCurrentProfile() : null;
  const stravaConnected = Boolean(profile?.strava_connected);

  return (
    <DashboardShell activePath="/outdoor">
      <div className="dashboard-content product-page">
        <header className="section-head product-page-header">
          <p className="karta-label">Ride Outdoor</p>
          <h1>Generate a loop</h1>
          <p className="dashboard-sub">
            Local Strava segments, road-routed GPX, distance matched to your target.
          </p>
        </header>

        {!user && (
          <p className="dashboard-notice dashboard-notice--warn">
            <a href="/login?next=/outdoor">Sign in</a> to generate a loop.
          </p>
        )}

        {user && !stravaConnected && <StravaConnectPanel returnTo="/outdoor" compact />}

        {user && stravaConnected && <RouteGeneratorWizard />}
      </div>
    </DashboardShell>
  );
}
