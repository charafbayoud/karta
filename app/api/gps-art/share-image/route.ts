import { NextRequest, NextResponse } from "next/server";
import {
  buildStaticMapUrl,
  buildStaticMapUrlFromStrokes,
  isStaticMapConfigured,
} from "@/lib/google/static-map";
import { densifyPath } from "@/lib/google/densify";
import { getGoogleMapsApiKey } from "@/lib/google/keys";
import type { GpsArtPoint } from "@/types/gps-art";

function isValidPoints(value: unknown): value is GpsArtPoint[] {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    value.every(
      (point) =>
        point &&
        typeof point === "object" &&
        typeof point.lat === "number" &&
        typeof point.lng === "number"
    )
  );
}

function isValidStrokes(value: unknown): value is GpsArtPoint[][] {
  return (
    Array.isArray(value) &&
    value.some((stroke) => isValidPoints(stroke))
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const shapeStrokes = body.shapeStrokes;
    const shapePoints = body.shapePoints;

    const apiKey = getGoogleMapsApiKey();
    if (!apiKey || !isStaticMapConfigured()) {
      return NextResponse.json(
        { error: "Google Static Maps is not configured." },
        { status: 503 }
      );
    }

    let mapUrl: string;

    if (isValidStrokes(shapeStrokes)) {
      const denseStrokes = shapeStrokes
        .filter((stroke) => stroke.length >= 2)
        .map((stroke) => densifyPath(stroke, 30, 150));
      mapUrl = buildStaticMapUrlFromStrokes(denseStrokes, apiKey);
    } else if (isValidPoints(shapePoints)) {
      const densePoints = densifyPath(shapePoints, 30, 150);
      mapUrl = buildStaticMapUrl(densePoints, apiKey);
    } else {
      return NextResponse.json({ error: "Invalid shape strokes." }, { status: 400 });
    }

    const mapResponse = await fetch(mapUrl, { signal: AbortSignal.timeout(15_000) });

    if (!mapResponse.ok) {
      const detail = await mapResponse.text();
      return NextResponse.json(
        {
          error:
            "Static map failed. Enable Maps Static API in Google Cloud Console.",
          detail: detail.slice(0, 200),
        },
        { status: 502 }
      );
    }

    const image = await mapResponse.arrayBuffer();
    const contentType = mapResponse.headers.get("content-type") ?? "image/png";

    return new NextResponse(image, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Share image error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate map image." },
      { status: 500 }
    );
  }
}
