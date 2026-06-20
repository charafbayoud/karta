"use client";

import { useActionState } from "react";
import { completeOnboarding, type AuthActionState } from "@/lib/auth/actions";
import type { PrimaryExperience, PrimarySport } from "@/types/user";
import {
  PRIMARY_EXPERIENCE_LABELS,
  PRIMARY_SPORT_LABELS,
} from "@/types/user";
import { useState } from "react";

const SPORTS: PrimarySport[] = ["cycling", "running", "walking"];
const EXPERIENCES: PrimaryExperience[] = ["indoor", "outdoor", "both"];

export function OnboardingForm() {
  const [sport, setSport] = useState<PrimarySport>("cycling");
  const [experience, setExperience] = useState<PrimaryExperience>("both");
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    completeOnboarding,
    {}
  );

  return (
    <div className="auth-card">
      <p className="karta-label">Almost there</p>
      <h1>Finish your profile</h1>
      <p className="auth-sub">Tell us how you ride so KARTA can personalize your dashboard.</p>

      <form action={formAction} className="auth-form">
        <input type="hidden" name="primary_sport" value={sport} />
        <input type="hidden" name="primary_experience" value={experience} />

        <p className="auth-step-title">Primary sport</p>
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

        <p className="auth-step-title">Primary experience</p>
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

        <button type="submit" className="btn-primary auth-submit" disabled={pending}>
          {pending ? "Saving…" : "Go to dashboard"}
        </button>
      </form>
    </div>
  );
}
