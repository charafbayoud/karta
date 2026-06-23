import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StravaConnectPanel } from "@/components/dashboard/StravaConnectPanel";
import { RouteGeneratorWizard } from "@/components/outdoor/RouteGeneratorWizard";
import { getCurrentProfile } from "@/lib/auth/profile";
import { requireUser } from "@/lib/auth/require-user";
import { isStravaLinked } from "@/lib/strava/linked";

export default async function OutdoorPage() {
  const user = await requireUser("/outdoor");
  const profile = await getCurrentProfile();
  const stravaConnected = isStravaLinked(profile, user);

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

        {!stravaConnected && <StravaConnectPanel returnTo="/outdoor" compact />}

        {stravaConnected && <RouteGeneratorWizard />}
      </div>
    </DashboardShell>
  );
}
