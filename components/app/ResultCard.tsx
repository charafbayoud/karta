import Link from "next/link";
import { WorldVisual } from "./WorldVisual";
import { WhyThisRoute } from "./WhyThisRoute";
import { ResultStats } from "./ResultStats";
import type { RecommendationResult, TrainingGoal } from "@/types/route";

interface ResultCardProps {
  result: RecommendationResult;
  trainingGoal: TrainingGoal;
  availableTime: number;
}

export function ResultCard({
  result,
  trainingGoal,
  availableTime,
}: ResultCardProps) {
  const { route, estimatedDuration, note } = result;

  return (
    <div className="result-layout">
      <div className="result-left">
        <div className="result-badge karta-badge">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M2 10 L5 4 L8 7 L12 2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Your route
        </div>

        <h1 className="result-title">{route.route_name}</h1>
        <p className="result-world font-data">
          {route.world} · {route.continent}
        </p>

        <div className="result-why">
          <WhyThisRoute availableTime={availableTime} trainingGoal={trainingGoal} />
        </div>

        {note && <p className="result-note">{note}</p>}

        <div className="result-actions">
          <Link href="/app" className="result-cta-link link-accent">
            Find another route ↗
          </Link>
          <button type="button" className="btn-primary result-save-btn" disabled>
            Save Route — Coming Soon
          </button>
        </div>

        <p className="result-footer-text">
          Matched from 123 Zwift routes based on your time, level and goal today.
        </p>
      </div>

      <div className="result-right">
        <div className="result-visual-wrap">
          <WorldVisual world={route.world} />
        </div>
        <ResultStats
          distanceKm={route.distance_km}
          elevationM={route.elevation_m}
          estimatedMinutes={estimatedDuration}
          difficulty={route.difficulty}
        />
      </div>
    </div>
  );
}
