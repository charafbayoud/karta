"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUpWithEmail, type AuthActionState } from "@/lib/auth/actions";
import { StravaAuthButton } from "./StravaAuthButton";
import { useAuthActionRedirect } from "./useAuthActionRedirect";
import type { PrimaryExperience, PrimarySport } from "@/types/user";
import {
  PRIMARY_EXPERIENCE_LABELS,
  PRIMARY_SPORT_LABELS,
} from "@/types/user";

const SPORTS: PrimarySport[] = ["cycling", "running", "walking"];
const EXPERIENCES: PrimaryExperience[] = ["indoor", "outdoor", "both"];

export function SignupForm() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step1Error, setStep1Error] = useState<string | null>(null);
  const [sport, setSport] = useState<PrimarySport>("cycling");
  const [experience, setExperience] = useState<PrimaryExperience>("both");
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    signUpWithEmail,
    {}
  );

  useAuthActionRedirect(state);

  function continueFromStep1() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setStep1Error("Enter your first name.");
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setStep1Error("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setStep1Error("Password must be at least 8 characters.");
      return;
    }

    setStep1Error(null);
    setStep(2);
  }

  return (
    <div className="auth-card">
      <p className="karta-label">Join KARTA</p>
      <h1>Sign up</h1>
      <p className="auth-sub">Step {step} of 3</p>

      <form action={formAction} className="auth-form">
        <input type="hidden" name="primary_sport" value={sport} />
        <input type="hidden" name="primary_experience" value={experience} />
        {step >= 2 && (
          <>
            <input type="hidden" name="name" value={name.trim()} />
            <input type="hidden" name="email" value={email.trim().toLowerCase()} />
            <input type="hidden" name="password" value={password} />
          </>
        )}

        {step === 1 && (
          <>
            <label>
              First name
              <input
                type="text"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                autoComplete="given-name"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>
            <p className="auth-field-hint">
              Minimum 8 characters. You can reset it anytime from the login page.
            </p>
            {step1Error && (
              <p className="auth-error" role="alert">
                {step1Error}
              </p>
            )}
            <button type="button" className="btn-primary auth-submit" onClick={continueFromStep1}>
              Continue
            </button>
            <div className="auth-divider">
              <span>or</span>
            </div>
            <StravaAuthButton
              mode="signup"
              className="btn-secondary auth-oauth-btn auth-oauth-strava"
            />
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
            {state.message && (
              <p className="dashboard-notice" role="status">
                {state.message}
              </p>
            )}
            <div className="auth-step-actions">
              <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button type="submit" className="btn-primary" disabled={pending}>
                {pending ? "Creating account…" : "Create my account"}
              </button>
            </div>
          </>
        )}
      </form>

      <p className="auth-switch">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}
