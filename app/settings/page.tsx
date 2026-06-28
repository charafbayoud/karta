import { DashboardShell } from "@/components/layout/DashboardShell";
import { SettingsActions } from "@/components/shared/DeleteAccountModal";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const DAY_MS = 24 * 60 * 60 * 1000;

function sessionRequiresReauth(lastSignInAt: string | undefined): boolean {
  if (!lastSignInAt) return true;
  const lastSignIn = new Date(lastSignInAt).getTime();
  if (Number.isNaN(lastSignIn)) return true;
  return Date.now() - lastSignIn > DAY_MS;
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/settings");
  }

  return (
    <DashboardShell activePath="/settings">
      <div className="dashboard-content">
        <header className="section-head">
          <p className="karta-label">Account</p>
          <h1>Settings</h1>
          <p className="dashboard-sub">
            Manage your data, privacy choices, and account lifecycle.
          </p>
        </header>

        <SettingsActions requiresPassword={sessionRequiresReauth(user.last_sign_in_at)} />
      </div>
    </DashboardShell>
  );
}
