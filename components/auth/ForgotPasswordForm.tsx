"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, type AuthActionState } from "@/lib/auth/actions";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    requestPasswordReset,
    {}
  );

  return (
    <div className="auth-card">
      <p className="karta-label">Forgot password</p>
      <h1>Reset your password</h1>
      <p className="auth-sub">
        Enter your account email and we&apos;ll send a link to choose a new password.
      </p>

      <form action={formAction} className="auth-form">
        <label>
          Email
          <input type="email" name="email" required autoComplete="email" />
        </label>
        {state.error && (
          <p className="auth-error" role="alert">
            {state.error}
          </p>
        )}
        {state.message && (
          <p className="dashboard-notice" role="status">
            {state.message}
          </p>
        )}
        <button type="submit" className="btn-primary auth-submit" disabled={pending}>
          {pending ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="auth-switch">
        <Link href="/login">Back to log in</Link>
      </p>
    </div>
  );
}
