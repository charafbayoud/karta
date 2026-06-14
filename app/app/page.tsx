"use client";

import Link from "next/link";
import { StepOne } from "@/components/app/StepOne";

export default function AppPage() {
  return (
    <main className="app-shell">
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link href="/" className="landing-logo">
            KARTA
          </Link>
          <span className="text-sm text-muted">
            Route Finder
          </span>
        </div>
      </header>

      <div className="app-quiz-container">
        <StepOne />
      </div>
    </main>
  );
}
