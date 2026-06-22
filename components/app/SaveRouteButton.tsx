"use client";

import { SaveRouteControl } from "@/components/dashboard/SaveRouteControl";
import type { RecommendationResult } from "@/types/route";

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

interface SaveRouteButtonProps {
  result: RecommendationResult;
}

export function SaveRouteButton({ result }: SaveRouteButtonProps) {
  return (
    <SaveRouteControl
      loginHref="/login?next=/app/result"
      payload={{
        routeName: result.route.route_name,
        type: "indoor",
        sport: "cycling",
        distanceKm: toNumber(result.route.distance_km),
        elevationM: toNumber(result.route.elevation_m),
        durationMin: toNumber(result.estimatedDuration),
        zwiftWorld: result.route.world,
        shapeType: result.route.difficulty,
      }}
    />
  );
}
