"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultCard } from "@/components/app/ResultCard";
import type {
  AvailableTime,
  RecommendationResult,
  RiderLevel,
  TrainingGoal,
} from "@/types/route";

interface StoredResult extends RecommendationResult {
  request: {
    availableTime: AvailableTime;
    riderLevel: RiderLevel;
    trainingGoal: TrainingGoal;
  };
}

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<StoredResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("karta-result");
    if (!raw) {
      router.replace("/app");
      return;
    }

    try {
      setData(JSON.parse(raw) as StoredResult);
    } catch {
      router.replace("/app");
    }
  }, [router]);

  if (!data) {
    return (
      <main className="app-shell flex min-h-screen items-center justify-center">
        <p className="text-muted">Loading your route…</p>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link href="/" className="landing-logo">
            KARTA
          </Link>
          <span className="text-sm text-muted">
            Your Route
          </span>
        </div>
      </header>

      <div className="result-page-container">
        <ResultCard
          result={data}
          trainingGoal={data.request.trainingGoal}
          availableTime={data.request.availableTime}
        />
      </div>
    </main>
  );
}
