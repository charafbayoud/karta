import { NextRequest, NextResponse } from "next/server";
import { generateGpsArtRouteAsync } from "@/lib/gps-art";
import type { GpsArtRequest } from "@/types/gps-art";
import { GPS_ART_MAX_LETTERS } from "@/types/gps-art";
import { isValidRouteGeneratorDistance } from "@/types/route-generator";

function isValidRequest(body: unknown): body is GpsArtRequest {
  if (!body || typeof body !== "object") return false;
  const value = body as GpsArtRequest;

  if (!["cycling", "running", "walking"].includes(value.sport)) return false;
  if (value.shapeType !== "alphabet") return false;
  if (!isValidRouteGeneratorDistance(value.sport, value.distanceKm)) return false;
  if (!value.start || typeof value.start.lat !== "number" || typeof value.start.lng !== "number") {
    return false;
  }

  const textPattern = new RegExp(`^[A-Za-z]{1,${GPS_ART_MAX_LETTERS}}$`);
  return typeof value.text === "string" && textPattern.test(value.text);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!isValidRequest(body)) {
      return NextResponse.json({ error: "Invalid GPS Art request." }, { status: 400 });
    }

    const result = await generateGpsArtRouteAsync(body);

    if (!result.snappedToRoads || !result.routeGpx) {
      return NextResponse.json(
        { error: "Route generation failed — no rideable GPX was produced." },
        { status: 422 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("GPS Art error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to generate GPS Art route.",
      },
      { status: 422 }
    );
  }
}
