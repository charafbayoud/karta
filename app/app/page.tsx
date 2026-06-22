"use client";

import { StepOne } from "@/components/app/StepOne";

export default function AppPage() {
  return (
    <>
      <header className="dashboard-header">
        <p className="karta-label">Ride Indoor</p>
        <h1>Route Finder</h1>
      </header>
      <div className="app-quiz-container app-quiz-container--embedded">
        <StepOne />
      </div>
    </>
  );
}
