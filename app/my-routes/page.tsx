import { DashboardShell } from "@/components/layout/DashboardShell";

export default function MyRoutesPage() {
  return (
    <DashboardShell activePath="/my-routes">
      <div className="dashboard-content">
        <p className="karta-label">My Routes</p>
        <h1>Saved routes</h1>
        <p className="dashboard-empty">
          No routes saved yet. Your indoor and outdoor rides will appear here.
        </p>
      </div>
    </DashboardShell>
  );
}
