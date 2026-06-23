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
    const origin = window.location.origin;
    const next = nextPath.startsWith("/") ? nextPath : "/dashboard";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      console.error("Google sign-in failed:", error.message);
    }
  }

  return (
    <button type="button" className="btn-secondary auth-oauth-btn" onClick={handleGoogleSignIn}>
      {label}
    </button>
  );
}
