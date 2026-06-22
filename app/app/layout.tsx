import { DashboardShell } from "@/components/layout/DashboardShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell activePath="/app">
      <div className="dashboard-content">{children}</div>
    </DashboardShell>
  );
}
