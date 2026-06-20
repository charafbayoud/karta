import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function IndoorPlaceholderPage() {
  return (
    <DashboardShell activePath="/indoor">
      <div className="dashboard-content">
        <p className="karta-label">Ride Indoor</p>
        <h1>Phase 2 — Indoor quiz</h1>
        <p className="dashboard-sub">
          The Zwift recommendation flow moves here next. For now, the V1 quiz still
          works at the legacy route.
        </p>
        <Link href="/app" className="btn-primary">
          Open V1 quiz (/app)
        </Link>
      </div>
    </DashboardShell>
  );
}
