"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpWithEmail, type AuthActionState } from "@/lib/auth/actions";
import { GoogleAuthButton } from "./GoogleAuthButton";
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
      <p className="karta-label">Join KARTA</p>
      <h1>Sign Up</h1>
      <p className="auth-sub">Étape {step} sur 3</p>

      <form action={formAction} className="auth-form">
        <input type="hidden" name="primary_sport" value={sport} />
        <input type="hidden" name="primary_experience" value={experience} />

        {step === 1 && (
          <>
            <label>
              First name
              <input type="text" name="name" required autoComplete="given-name" />
            </label>
            <label>
              Email
              <input type="email" name="email" required autoComplete="email" />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>
            <button type="button" className="btn-primary auth-submit" onClick={() => setStep(2)}>
              Continue
            </button>
            <div className="auth-divider">
              <span>or</span>
            </div>
            <GoogleAuthButton label="Sign up with Google" />
            <StravaAuthButton mode="signup" />
          </>
        )}

        {step === 2 && (
          <>
            <p className="auth-step-title">Choose your primary sport</p>
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
                Back
              </button>
              <button type="button" className="btn-primary" onClick={() => setStep(3)}>
                Continue
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="auth-step-title">Choose your primary experience</p>
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
                Back
              </button>
              <button type="submit" className="btn-primary" disabled={pending}>
                {pending ? "Creating account…" : "Create account"}
              </button>
            </div>
          </>
        )}
      </form>

      <p className="auth-switch">
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
}
