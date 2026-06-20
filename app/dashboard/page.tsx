import Link from "next/link";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getCurrentProfile, getFirstName } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

  return (
    <DashboardShell activePath="/dashboard">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <p className="karta-label">Dashboard</p>
          <h1>Welcome back, {firstName}</h1>
          <p className="dashboard-sub">Ready for your next ride?</p>
        </header>

        <section className="dashboard-quick-grid">
          <Link href="/indoor" className="dashboard-quick-card">
            <span aria-hidden>🖥️</span>
            <h2>Ride Indoor</h2>
            <p>Find your perfect Zwift route in a few clicks.</p>
          </Link>
          <Link href="/outdoor" className="dashboard-quick-card">
            <span aria-hidden>🗺️</span>
            <h2>Ride Outdoor</h2>
            <p>GPS Art and smart outdoor route generation.</p>
          </Link>
        </section>

        {!profile.strava_connected && (
          <section className="dashboard-banner">
            <div>
              <h2>Connect Strava</h2>
              <p>Unlock popular routes in your area — coming in a later phase.</p>
            </div>
            <button type="button" className="btn-secondary" disabled>
              Connect Strava
            </button>
          </section>
        )}

        <section className="dashboard-panel">
          <h2>Recent routes</h2>
          <p className="dashboard-empty">
            No saved routes yet. Complete a ride to see it here.
          </p>
        </section>
      </div>
    </DashboardShell>
  );
}
