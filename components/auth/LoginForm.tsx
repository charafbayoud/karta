"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInWithEmail, type AuthActionState } from "@/lib/auth/actions";
import { StravaAuthButton } from "./StravaAuthButton";
import { useAuthActionRedirect } from "./useAuthActionRedirect";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    signInWithEmail,
    {}
  );

  useAuthActionRedirect(state);

  return (
    <div className="auth-card">
      <p className="karta-label">Welcome back</p>
      <h1>Log in</h1>
      <p className="auth-sub">Sign in with your email or Strava account.</p>

      <form action={formAction} className="auth-form">
        <input type="hidden" name="next" value={nextPath} />
        <label>
          Email
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label>
          Password
          <input type="password" name="password" required autoComplete="current-password" />
        </label>
        <p className="auth-forgot-link">
          <Link href="/login/forgot-password">Forgot password?</Link>
        </p>
        {state.error && (
          <p className="auth-error" role="alert">
            {state.error}
          </p>
        )}
        <button type="submit" className="btn-primary auth-submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <StravaAuthButton
        mode="login"
        returnTo={nextPath}
        className="btn-secondary auth-oauth-btn auth-oauth-strava"
      />

      <p className="auth-switch">
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </p>
    </div>
  );
}
