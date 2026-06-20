import { DashboardShell } from "@/components/layout/DashboardShell";

export default function OutdoorPlaceholderPage() {
  return (
    <DashboardShell activePath="/outdoor">
      <div className="dashboard-content">
        <p className="karta-label">Ride Outdoor</p>
        <h1>Phase 4 — Outdoor</h1>
        <p className="dashboard-sub">
          GPS Art and the route generator arrive in a later phase of the V2 build.
        </p>
      </div>
    </DashboardShell>
  );
}
