import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SavedRouteDetail } from "@/components/dashboard/SavedRouteDetail";
import { getSavedRouteById } from "@/lib/saved-routes/server";
import { createClient } from "@/lib/supabase/server";

type SavedRoutePageProps = {
  params: Promise<{ id: string }>;
};

export default async function SavedRoutePage({ params }: SavedRoutePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/my-routes/${id}`);
  }

  const route = await getSavedRouteById(id);
  if (!route) {
    notFound();
  }

  return (
    <DashboardShell activePath="/my-routes">
      <div className="dashboard-content">
        <Link href="/my-routes" className="saved-route-back link-accent">
          ← My Routes
        </Link>
        <SavedRouteDetail route={route} />
      </div>
    </DashboardShell>
  );
}
