import { NextRequest, NextResponse } from "next/server";
import { fetchRoutes } from "@/lib/routes";
import { recommendRoute } from "@/lib/recommend";
import type { RecommendationRequest } from "@/types/route";
import {
  AVAILABLE_TIME_OPTIONS,
  RIDER_LEVELS,
  TRAINING_GOALS,
} from "@/types/route";

function isValidRequest(body: unknown): body is RecommendationRequest {
  if (!body || typeof body !== "object") return false;
  const { availableTime, riderLevel, trainingGoal } = body as RecommendationRequest;
  return (
    AVAILABLE_TIME_OPTIONS.includes(availableTime) &&
    RIDER_LEVELS.includes(riderLevel) &&
    TRAINING_GOALS.includes(trainingGoal)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!isValidRequest(body)) {
      return NextResponse.json({ error: "Invalid recommendation request." }, { status: 400 });
    }

    const { routes, source } = await fetchRoutes();

    if (routes.length === 0) {
      return NextResponse.json(
        { error: "No routes available. Please seed the database." },
        { status: 503 }
      );
    }

    const result = recommendRoute(routes, body);

    return NextResponse.json({ ...result, source });
  } catch (error) {
    console.error("Recommend error:", error);
    return NextResponse.json(
      { error: "Unable to generate a recommendation. Please try again." },
      { status: 500 }
    );
  }
}
