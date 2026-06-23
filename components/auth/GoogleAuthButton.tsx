"use client";

import { signInWithGoogle } from "@/lib/auth/actions";

export function GoogleAuthButton({
  label,
  nextPath = "/dashboard",
}: {
  label: string;
  nextPath?: string;
}) {
  return (
    <form action={signInWithGoogle}>
      <input type="hidden" name="next" value={nextPath} />
      <button type="submit" className="btn-secondary auth-oauth-btn">
        {label}
      </button>
    </form>
  );
}
