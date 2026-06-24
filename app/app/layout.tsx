import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { requireUser } from "@/lib/auth/require-user";
import { NOINDEX_METADATA } from "@/lib/seo/metadata";

export const metadata: Metadata = NOINDEX_METADATA;

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireUser("/app");

  return (
    <DashboardShell activePath="/app">
      <div className="dashboard-content">{children}</div>
    </DashboardShell>
  );
}
