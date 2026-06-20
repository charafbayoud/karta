import { Sidebar } from "./Sidebar";

export function DashboardShell({
  activePath,
  children,
}: {
  activePath: string;
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-shell">
      <Sidebar activePath={activePath} />
      <div className="dashboard-main">{children}</div>
    </div>
  );
}
