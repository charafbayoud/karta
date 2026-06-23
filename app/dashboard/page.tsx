import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SavedRoutesList } from "@/components/dashboard/SavedRoutesList";
import { getCurrentProfile, getFirstName } from "@/lib/auth/profile";
import { getSavedRoutes } from "@/lib/saved-routes/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function ModeIcon({ type }: { type: "indoor" | "outdoor" }) {
  if (type === "indoor") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="dashboard-mode-icon">
        <rect x="4" y="6" width="24" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 22v4M22 22v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="dashboard-mode-icon">
      <path
        d="M6 22 Q 12 10, 18 16 T 26 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="6" cy="22" r="2" fill="currentColor" />
    </svg>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getCurrentProfile();
  if (!profile?.primary_sport || !profile?.primary_experience) {
    redirect("/signup/onboarding");
  }

  const firstName = getFirstName(profile, user.email);
  const recentRoutes = await getSavedRoutes(5);

  return (
    <DashboardShell activePath="/dashboard">
      <div className="dashboard-content">
        <header className="section-head">
          <p className="karta-label">Dashboard</p>
          <h1>Welcome back, {firstName}</h1>
          <p className="dashboard-sub">Pick a mode — we&apos;ll handle the route.</p>
        </header>

        <section className="dashboard-quick-grid">
          <Link href="/app" className="dashboard-quick-card dashboard-quick-card--premium">
            <ModeIcon type="indoor" />
            <h2>Ride Indoor</h2>
            <p>Matched Zwift route in three taps.</p>
            <span className="dashboard-card-link">Start quiz →</span>
          </Link>
          <Link href="/outdoor" className="dashboard-quick-card dashboard-quick-card--premium">
            <ModeIcon type="outdoor" />
            <h2>Ride Outdoor</h2>
            <p>GPX loops on real roads — Strava segments or Google Routes.</p>
            <span className="dashboard-card-link">Generate loop →</span>
          </Link>
        </section>

        <section className="dashboard-panel">
          <h2>Recent routes</h2>
          <SavedRoutesList
            routes={recentRoutes}
            emptyMessage="No saved routes yet. Generate a loop or complete a quiz, then tap Save Route."
            showViewAllLink={recentRoutes.length > 0}
          />
        </section>
      </div>
    </DashboardShell>
  );
}
