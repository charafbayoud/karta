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
      <p className="karta-label">Bon retour</p>
      <h1>Connexion</h1>
      <p className="auth-sub">Connecte-toi avec ton email ou ton compte Strava.</p>

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
        <p className="auth-forgot-link">
          <Link href="/login/forgot-password">Mot de passe oublié ?</Link>
        </p>
        {state.error && (
          <p className="auth-error" role="alert">
            {state.error}
          </p>
        )}
        <button type="submit" className="btn-primary auth-submit" disabled={pending}>
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <div className="auth-divider">
        <span>ou</span>
      </div>

      <StravaAuthButton
        mode="login"
        returnTo={nextPath}
        className="btn-secondary auth-oauth-btn auth-oauth-strava"
      />

      <p className="auth-switch">
        Pas encore de compte ? <Link href="/signup">S&apos;inscrire</Link>
      </p>
    </div>
  );
}
