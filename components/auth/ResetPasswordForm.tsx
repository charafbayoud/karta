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
      <p className="karta-label">Nouveau mot de passe</p>
      <h1>Choisis ton mot de passe</h1>
      <p className="auth-sub">Minimum 8 caractères.</p>

      <form action={formAction} className="auth-form">
        <label>
          Nouveau mot de passe
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        <label>
          Confirmer le mot de passe
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
          {pending ? "Enregistrement…" : "Enregistrer le mot de passe"}
        </button>
      </form>

      <p className="auth-switch">
        <Link href="/login/forgot-password">Demander un nouveau lien</Link>
      </p>
    </div>
  );
}
