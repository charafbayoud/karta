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
      <p className="karta-label">Mot de passe oublié</p>
      <h1>Réinitialisation</h1>
      <p className="auth-sub">
        Indique l&apos;email de ton compte. Tu recevras un lien pour choisir un nouveau mot de
        passe.
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
          {pending ? "Envoi…" : "Envoyer le lien"}
        </button>
      </form>

      <p className="auth-switch">
        <Link href="/login">Retour à la connexion</Link>
      </p>
    </div>
  );
}
