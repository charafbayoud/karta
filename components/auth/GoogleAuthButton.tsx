"use client";

import { createClient } from "@/lib/supabase/client";

export function GoogleAuthButton({ label }: { label: string }) {
  async function handleGoogleSignIn() {
    const supabase = createClient();
    const appUrl = window.location.origin;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${appUrl}/auth/callback`,
      },
    });
  }

  return (
    <button type="button" className="btn-secondary auth-oauth-btn" onClick={handleGoogleSignIn}>
      {label}
    </button>
  );
}
