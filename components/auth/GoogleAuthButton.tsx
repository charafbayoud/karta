"use client";

import { createClient } from "@/lib/supabase/client";

export function GoogleAuthButton({
  label,
  nextPath = "/dashboard",
}: {
  label: string;
  nextPath?: string;
}) {
  async function handleGoogleSignIn() {
    const supabase = createClient();
    const appUrl = window.location.origin;
    const next = nextPath.startsWith("/") ? nextPath : "/dashboard";

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  return (
    <button type="button" className="btn-secondary auth-oauth-btn" onClick={handleGoogleSignIn}>
      {label}
    </button>
  );
}
