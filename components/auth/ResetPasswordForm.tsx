"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updatePassword, type AuthActionState } from "@/lib/auth/actions";
import { useAuthActionRedirect } from "./useAuthActionRedirect";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    updatePassword,
    {}
  );

  useAuthActionRedirect(state);

  return (
    <div className="auth-card">
      <p className="karta-label">New password</p>
      <h1>Choose a new password</h1>
      <p className="auth-sub">Minimum 8 characters.</p>

      <form action={formAction} className="auth-form">
        <label>
          New password
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <label>
          Confirm password
          <input
            type="password"
            name="confirm_password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        {state.error && (
          <p className="auth-error" role="alert">
            {state.error}
          </p>
        )}
        <button type="submit" className="btn-primary auth-submit" disabled={pending}>
          {pending ? "Saving…" : "Save password"}
        </button>
      </form>

      <p className="auth-switch">
        <Link href="/login/forgot-password">Request a new link</Link>
      </p>
    </div>
  );
}
