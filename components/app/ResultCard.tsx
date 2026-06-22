import Link from "next/link";
import { RouteCircuitSchema } from "./RouteCircuitSchema";
import { SaveRouteButton } from "./SaveRouteButton";
import { WhyThisRoute } from "./WhyThisRoute";
import { ResultStats } from "./ResultStats";
import {
  buildRouteCircuitSchema,
  type RouteCircuitSchema as RouteCircuitSchemaData,
} from "@/lib/route-circuit-schema";
import type { RecommendationResult, TrainingGoal } from "@/types/route";

interface ResultCardProps {
  result: RecommendationResult;
  trainingGoal: TrainingGoal;
  availableTime: number;
  circuitSchema?: RouteCircuitSchemaData;
  circuitSeed?: number;
}

export function ResultCard({
  result,
  trainingGoal,
  availableTime,
  circuitSchema,
  circuitSeed,
}: ResultCardProps) {
  const { route, estimatedDuration, note } = result;
  const schema = circuitSchema ?? buildRouteCircuitSchema(route, circuitSeed);

  return (
    <div className="result-layout">
      <div className="result-head">
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
      </div>

      <div className="result-visual-wrap">
        <RouteCircuitSchema route={route} schema={schema} />
        <p className="result-visual-caption">
          Schéma · {route.world}
        </p>
      </div>

      <ResultStats
        distanceKm={route.distance_km}
        elevationM={route.elevation_m}
        estimatedMinutes={estimatedDuration}
        difficulty={route.difficulty}
      />

      <div className="result-why">
        <WhyThisRoute availableTime={availableTime} trainingGoal={trainingGoal} />
      </div>

      {note && <p className="result-note">{note}</p>}

      <div className="result-actions">
        <Link href="/app" className="result-cta-link link-accent">
          Find another route ↗
        </Link>
        <SaveRouteButton result={result} />
      </div>

      <p className="result-footer-text">
        Matched from 123 Zwift routes based on your time, level and goal today.
      </p>
    </div>
  );
}
