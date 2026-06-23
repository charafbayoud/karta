"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInWithEmail, type AuthActionState } from "@/lib/auth/actions";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    signInWithEmail,
    {}
  );

  return (
    <div className="auth-card">
      <p className="karta-label">Bon retour</p>
      <h1>Connexion</h1>
      <p className="auth-sub">Connecte-toi avec ton email pour accéder au dashboard.</p>

      <form action={formAction} className="auth-form">
        <input type="hidden" name="next" value={nextPath} />
        <label>
          Email
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label>
          Mot de passe
          <input type="password" name="password" required autoComplete="current-password" />
        </label>
        {state.error && (
          <p className="auth-error" role="alert">
            {state.error}
          </p>
        )}
        <button type="submit" className="btn-primary auth-submit" disabled={pending}>
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p className="auth-switch">
        Pas encore de compte ? <Link href="/signup">S&apos;inscrire</Link>
      </p>
    </div>
  );
}
