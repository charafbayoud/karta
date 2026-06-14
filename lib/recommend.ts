import type {
  RecommendationRequest,
  RecommendationResult,
  Route,
  RiderLevel,
  TrainingGoal,
} from "@/types/route";
import { getEstimatedTime } from "@/types/route";

const DURATION_TOLERANCE = 15;

function matchesTrainingGoal(route: Route, goal: TrainingGoal): boolean {
  switch (goal) {
    case "recovery":
      return route.elevation_m < 100;
    case "endurance":
      return route.distance_km >= 20 && route.distance_km <= 50;
    case "climbing":
      return route.elevation_m > 500;
    case "challenge":
      return route.difficulty === "epic";
    case "surprise":
      return true;
    default:
      return true;
  }
}

function durationDelta(route: Route, targetMinutes: number, level: RiderLevel): number {
  return Math.abs(getEstimatedTime(route, level) - targetMinutes);
}

function withinDuration(route: Route, targetMinutes: number, level: RiderLevel): boolean {
  return durationDelta(route, targetMinutes, level) <= DURATION_TOLERANCE;
}

function pickClosestByDuration(
  routes: Route[],
  targetMinutes: number,
  level: RiderLevel
): Route {
  return routes.reduce((best, current) =>
    durationDelta(current, targetMinutes, level) <
    durationDelta(best, targetMinutes, level)
      ? current
      : best
  );
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function recommendRoute(
  routes: Route[],
  request: RecommendationRequest
): RecommendationResult {
  const { availableTime, riderLevel, trainingGoal } = request;

  if (routes.length === 0) {
    throw new Error("No routes available for recommendation.");
  }

  const durationMatches = routes.filter((route) =>
    withinDuration(route, availableTime, riderLevel)
  );

  const pool = durationMatches.length > 0 ? durationMatches : routes;

  const goalMatches = pool.filter((route) =>
    matchesTrainingGoal(route, trainingGoal)
  );

  let selected: Route;
  let adjusted = false;

  if (goalMatches.length > 0) {
    if (trainingGoal === "surprise") {
      selected = pickRandom(goalMatches);
    } else {
      selected = pickClosestByDuration(goalMatches, availableTime, riderLevel);
    }
  } else if (durationMatches.length > 0) {
    selected = pickClosestByDuration(durationMatches, availableTime, riderLevel);
    adjusted = true;
  } else {
    selected = pickClosestByDuration(routes, availableTime, riderLevel);
    adjusted = true;
  }

  if (!withinDuration(selected, availableTime, riderLevel)) {
    adjusted = true;
  }

  const estimatedDuration = getEstimatedTime(selected, riderLevel);

  return {
    route: selected,
    estimatedDuration,
    adjusted,
    note: adjusted
      ? "We adjusted slightly to find your best option today."
      : undefined,
  };
}
