import { DashboardShell } from "@/components/layout/DashboardShell";
import { SavedRoutesList } from "@/components/dashboard/SavedRoutesList";
import { getSavedRoutes } from "@/lib/saved-routes/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MyRoutesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/my-routes");
  }

  const routes = await getSavedRoutes();

  return (
    <DashboardShell activePath="/my-routes">
      <div className="dashboard-content">
        <p className="karta-label">My Routes</p>
        <h1>Saved routes</h1>
        <p className="dashboard-sub">
          Routes you saved from Ride Indoor and Ride Outdoor.
        </p>

        <section className="dashboard-panel dashboard-panel--flush">
          <SavedRoutesList
            routes={routes}
            emptyMessage="No routes saved yet. Finish a ride and tap Save Route on the result page."
            showDelete
          />
        </section>
      </div>
    </DashboardShell>
  );
}
