"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ResultCard } from "@/components/app/ResultCard";
import type { RouteCircuitSchema } from "@/lib/route-circuit-schema";
import type {
  AvailableTime,
  RecommendationResult,
  RiderLevel,
  TrainingGoal,
} from "@/types/route";

interface StoredResult extends RecommendationResult {
  circuitSchema?: RouteCircuitSchema;
  circuitSeed?: number;
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
    return <p className="text-muted">Loading your route…</p>;
  }

  return (
    <>
      <header className="dashboard-header">
        <p className="karta-label">Ride Indoor</p>
        <h1>Your Route</h1>
      </header>
      <div className="result-page-container result-page-container--embedded">
        <ResultCard
          result={data}
          trainingGoal={data.request.trainingGoal}
          availableTime={data.request.availableTime}
          circuitSchema={data.circuitSchema}
          circuitSeed={data.circuitSeed}
        />
      </div>
    </>
  );
}
