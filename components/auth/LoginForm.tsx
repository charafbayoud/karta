"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInWithEmail, type AuthActionState } from "@/lib/auth/actions";
import { GoogleAuthButton } from "./GoogleAuthButton";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    signInWithEmail,
    {}
  );

  return (
    <div className="auth-card">
      <p className="karta-label">Welcome back</p>
      <h1>Login</h1>
      <p className="auth-sub">Sign in to access your dashboard and saved routes.</p>

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
        {state.error && (
          <p className="auth-error" role="alert">
            {state.error}
          </p>
        )}
        <button type="submit" className="btn-primary auth-submit" disabled={pending}>
          {pending ? "Signing in…" : "Login"}
        </button>
      </form>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <GoogleAuthButton label="Continue with Google" />

      <p className="auth-switch">
        No account yet? <Link href="/signup">Sign up</Link>
      </p>
    </div>
  );
}
