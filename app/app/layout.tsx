import { DashboardShell } from "@/components/layout/DashboardShell";
import { requireUser } from "@/lib/auth/require-user";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireUser("/app");

  return (
    <DashboardShell activePath="/app">
      <div className="dashboard-content">{children}</div>
    </DashboardShell>
  );
}
