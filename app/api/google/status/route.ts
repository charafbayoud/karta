import { NextResponse } from "next/server";
import {
  getGoogleRoadsApiKey,
  getGoogleRoutesApiKey,
  isGoogleMapsConfigured,
} from "@/lib/google/keys";

export async function GET() {
  const roadsKey = getGoogleRoadsApiKey();
  const routesKey = getGoogleRoutesApiKey();

  const checks: Record<string, string> = {
    mapsKey: isGoogleMapsConfigured() ? "ok" : "missing",
    roadsKey: roadsKey ? "ok" : "missing",
    routesKey: routesKey ? "ok" : "missing",
  };

  if (roadsKey) {
    try {
      const url = new URL("https://roads.googleapis.com/v1/snapToRoads");
      url.searchParams.set("path", "48.8566,2.3522|48.8576,2.3532");
      url.searchParams.set("interpolate", "true");
      url.searchParams.set("key", roadsKey);

      const response = await fetch(url.toString(), { signal: AbortSignal.timeout(8_000) });
      const data = await response.json();

      if (response.ok && data.snappedPoints?.length) {
        checks.roadsApi = "ok";
      } else {
        checks.roadsApi = data.error?.message ?? "failed";
      }
    } catch (error) {
      checks.roadsApi =
        error instanceof Error ? error.message : "Roads API unreachable";
    }
  }

  if (routesKey) {
    try {
      const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": routesKey,
          "X-Goog-FieldMask": "routes.distanceMeters",
        },
        body: JSON.stringify({
          origin: { location: { latLng: { latitude: 48.8566, longitude: 2.3522 } } },
          destination: { location: { latLng: { latitude: 48.8606, longitude: 2.3376 } } },
          travelMode: "BICYCLE",
        }),
        signal: AbortSignal.timeout(8_000),
      });

      const data = await response.json();
      checks.routesApi = response.ok ? "ok" : data.error?.message ?? "failed";
    } catch (error) {
      checks.routesApi =
        error instanceof Error ? error.message : "Routes API unreachable";
    }
  }

  return NextResponse.json({
    ok: Object.values(checks).every((value) => value === "ok"),
    checks,
    hint:
      checks.roadsApi !== "ok" || checks.routesApi !== "ok"
        ? "Enable Roads + Routes APIs and billing in Google Cloud. Server keys must not be HTTP-referrer restricted."
        : undefined,
  });
}
