import { DashboardShell } from "@/components/layout/DashboardShell";
import { RouteGeneratorWizard } from "@/components/outdoor/RouteGeneratorWizard";
import { requireUser } from "@/lib/auth/require-user";

export default async function OutdoorPage() {
  await requireUser("/outdoor");

  return (
    <DashboardShell activePath="/outdoor">
      <div className="dashboard-content product-page">
        <header className="section-head product-page-header">
          <p className="karta-label">Ride Outdoor</p>
          <h1>Generate a loop</h1>
          <p className="dashboard-sub">
            Strava segments when available, road-routed GPX loops via Google Routes.
          </p>
        </header>

        <RouteGeneratorWizard />
      </div>
    </DashboardShell>
  );
}
