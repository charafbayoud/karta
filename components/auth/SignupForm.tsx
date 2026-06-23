"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpWithEmail, type AuthActionState } from "@/lib/auth/actions";
import { StravaAuthButton } from "./StravaAuthButton";
import type { PrimaryExperience, PrimarySport } from "@/types/user";
import {
  PRIMARY_EXPERIENCE_LABELS,
  PRIMARY_SPORT_LABELS,
} from "@/types/user";

const SPORTS: PrimarySport[] = ["cycling", "running", "walking"];
const EXPERIENCES: PrimaryExperience[] = ["indoor", "outdoor", "both"];

export function SignupForm() {
  const [step, setStep] = useState(1);
  const [sport, setSport] = useState<PrimarySport>("cycling");
  const [experience, setExperience] = useState<PrimaryExperience>("both");
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    signUpWithEmail,
    {}
  );

  return (
    <div className="auth-card">
      <p className="karta-label">Rejoindre KARTA</p>
      <h1>Inscription</h1>
      <p className="auth-sub">Étape {step} sur 3</p>

      <form action={formAction} className="auth-form">
        <input type="hidden" name="primary_sport" value={sport} />
        <input type="hidden" name="primary_experience" value={experience} />

        {step === 1 && (
          <>
            <label>
              Prénom
              <input type="text" name="name" required autoComplete="given-name" />
            </label>
            <label>
              Email
              <input type="email" name="email" required autoComplete="email" />
            </label>
            <label>
              Mot de passe
              <input
                type="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>
            <button type="button" className="btn-primary auth-submit" onClick={() => setStep(2)}>
              Continuer
            </button>
            <div className="auth-divider">
              <span>ou</span>
            </div>
            <StravaAuthButton
              mode="signup"
              className="btn-secondary auth-oauth-btn auth-oauth-strava"
            />
          </>
        )}

        {step === 2 && (
          <>
            <p className="auth-step-title">Choisis ton sport principal</p>
            <div className="auth-option-grid">
              {SPORTS.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`auth-option ${sport === value ? "is-selected" : ""}`}
                  onClick={() => setSport(value)}
                >
                  {PRIMARY_SPORT_LABELS[value]}
                </button>
              ))}
            </div>
            <div className="auth-step-actions">
              <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                Retour
              </button>
              <button type="button" className="btn-primary" onClick={() => setStep(3)}>
                Continuer
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="auth-step-title">Choisis ton expérience principale</p>
            <div className="auth-option-grid">
              {EXPERIENCES.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`auth-option ${experience === value ? "is-selected" : ""}`}
                  onClick={() => setExperience(value)}
                >
                  {PRIMARY_EXPERIENCE_LABELS[value]}
                </button>
              ))}
            </div>
            {state.error && (
              <p className="auth-error" role="alert">
                {state.error}
              </p>
            )}
            <div className="auth-step-actions">
              <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
                Retour
              </button>
              <button type="submit" className="btn-primary" disabled={pending}>
                {pending ? "Création…" : "Créer mon compte"}
              </button>
            </div>
          </>
        )}
      </form>

      <p className="auth-switch">
        Déjà un compte ? <Link href="/login">Se connecter</Link>
      </p>
    </div>
  );
}
