"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuizSidebar } from "./QuizSidebar";
import { QuizCard } from "./QuizCard";
import { LoadingAnimation } from "./LoadingAnimation";
import {
  IconTime,
  IconLevel,
  IconRecovery,
  IconEndurance,
  IconClimbing,
  IconChallenge,
  IconSurprise,
} from "./QuizIcons";
import type {
  AvailableTime,
  RecommendationResult,
  RiderLevel,
  TrainingGoal,
} from "@/types/route";
import {
  AVAILABLE_TIME_OPTIONS,
  RIDER_LEVEL_LABELS,
  TRAINING_GOAL_LABELS,
} from "@/types/route";

type Phase = "quiz" | "loading";
type QuizStep = 1 | 2 | 3;

const TIME_OPTIONS: { value: AvailableTime; label: string; minutes: number }[] =
  AVAILABLE_TIME_OPTIONS.map((time) => ({
    value: time,
    label: time === 120 ? "120+ min" : `${time} min`,
    minutes: time,
  }));

const LEVEL_OPTIONS: { value: RiderLevel; label: string; bars: number }[] = [
  { value: "beginner", label: RIDER_LEVEL_LABELS.beginner, bars: 1 },
  { value: "intermediate", label: RIDER_LEVEL_LABELS.intermediate, bars: 2 },
  { value: "advanced", label: RIDER_LEVEL_LABELS.advanced, bars: 3 },
  { value: "competitive", label: RIDER_LEVEL_LABELS.competitive, bars: 4 },
];

const GOAL_OPTIONS: {
  value: TrainingGoal;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "recovery", label: TRAINING_GOAL_LABELS.recovery, icon: <IconRecovery /> },
  { value: "endurance", label: TRAINING_GOAL_LABELS.endurance, icon: <IconEndurance /> },
  { value: "climbing", label: TRAINING_GOAL_LABELS.climbing, icon: <IconClimbing /> },
  { value: "challenge", label: TRAINING_GOAL_LABELS.challenge, icon: <IconChallenge /> },
  { value: "surprise", label: TRAINING_GOAL_LABELS.surprise, icon: <IconSurprise /> },
];

const STEP_CONTENT: Record<
  QuizStep,
  { eyebrow: string; title: string; description: string }
> = {
  1: {
    eyebrow: "Step 1",
    title: "How much time do you have?",
    description:
      "Choose your available riding window. KARTA will match a route that fits your schedule.",
  },
  2: {
    eyebrow: "Step 2",
    title: "What's your riding level?",
    description:
      "From first rides to race pace — we'll estimate duration and difficulty for you.",
  },
  3: {
    eyebrow: "Step 3",
    title: "What's your goal today?",
    description:
      "Recovery spin, endurance base, climbing session, epic challenge, or a surprise pick.",
  },
};

export function StepOne() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("quiz");
  const [quizStep, setQuizStep] = useState<QuizStep>(1);
  const [availableTime, setAvailableTime] = useState<AvailableTime>(60);
  const [riderLevel, setRiderLevel] = useState<RiderLevel>("intermediate");
  const [trainingGoal, setTrainingGoal] = useState<TrainingGoal>("endurance");
  const [error, setError] = useState("");

  async function submitRecommendation() {
    setError("");
    setPhase("loading");

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availableTime, riderLevel, trainingGoal }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Unable to find a route.");
      }

      const result = data as RecommendationResult;

      sessionStorage.setItem(
        "karta-result",
        JSON.stringify({
          ...result,
          request: { availableTime, riderLevel, trainingGoal },
        })
      );

      setTimeout(() => {
        router.push("/app/result");
      }, 2000);
    } catch (err) {
      setPhase("quiz");
      setQuizStep(3);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function handleNext() {
    setError("");
    if (quizStep < 3) {
      setQuizStep((s) => (s + 1) as QuizStep);
      return;
    }
    submitRecommendation();
  }

  function handleBack() {
    setError("");
    if (quizStep > 1) setQuizStep((s) => (s - 1) as QuizStep);
  }

  if (phase === "loading") {
    return (
      <div className="quiz-layout">
        <QuizSidebar currentStep={3} completedThrough={3} />
        <div className="quiz-main quiz-main-loading">
          <LoadingAnimation />
        </div>
      </div>
    );
  }

  const content = STEP_CONTENT[quizStep];
  const isLastStep = quizStep === 3;

  return (
    <div className="quiz-layout">
      <QuizSidebar currentStep={quizStep} />

      <div className="quiz-main">
        <div className="quiz-content">
          <p className="quiz-eyebrow">{content.eyebrow}</p>
          <h1 className="quiz-title">{content.title}</h1>
          <p className="quiz-description">{content.description}</p>

          <div className="quiz-grid" role="group" aria-label={content.title}>
            {quizStep === 1 &&
              TIME_OPTIONS.map((option) => (
                <QuizCard
                  key={option.value}
                  label={option.label}
                  selected={availableTime === option.value}
                  onSelect={() => setAvailableTime(option.value)}
                  icon={<IconTime minutes={option.minutes} />}
                />
              ))}

            {quizStep === 2 &&
              LEVEL_OPTIONS.map((option) => (
                <QuizCard
                  key={option.value}
                  label={option.label}
                  selected={riderLevel === option.value}
                  onSelect={() => setRiderLevel(option.value)}
                  icon={<IconLevel bars={option.bars} />}
                />
              ))}

            {quizStep === 3 &&
              GOAL_OPTIONS.map((option) => (
                <QuizCard
                  key={option.value}
                  label={option.label}
                  selected={trainingGoal === option.value}
                  onSelect={() => setTrainingGoal(option.value)}
                  icon={option.icon}
                />
              ))}
          </div>

          {error && (
            <p className="quiz-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="quiz-footer">
          {quizStep > 1 && (
            <button type="button" className="quiz-back-btn" onClick={handleBack}>
              ← Back
            </button>
          )}
          <button type="button" className="btn-primary quiz-next-btn" onClick={handleNext}>
            {isLastStep ? "Find My Route" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
