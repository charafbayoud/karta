import type { GpsArtPoint, OutdoorSport } from "@/types/gps-art";
import { getGoogleRoutesApiKey } from "@/lib/google/keys";

type RouteStats = {
  distanceKm: number;
  durationMin: number;
};

type ComputeRoutesResponse = {
  routes?: Array<{
    distanceMeters?: number;
    duration?: string;
  }>;
  error?: { message?: string };
};

function travelModeForSport(sport: OutdoorSport): string {
  if (sport === "cycling") return "BICYCLE";
  return "WALK";
}

function parseDurationSeconds(duration: string | undefined): number {
  if (!duration) return 0;
  const match = duration.match(/(\d+)s/);
  return match ? Number(match[1]) : 0;
}

function sampleWaypoints(points: GpsArtPoint[], maxWaypoints = 23): GpsArtPoint[] {
  if (points.length <= maxWaypoints + 2) return points.slice(1, -1);

  const sampled: GpsArtPoint[] = [];
  const step = (points.length - 1) / (maxWaypoints + 1);

  for (let i = 1; i <= maxWaypoints; i += 1) {
    sampled.push(points[Math.round(i * step)]);
  }

  return sampled;
}

function latLng(point: GpsArtPoint) {
  return {
    location: {
      latLng: {
        latitude: point.lat,
        longitude: point.lng,
      },
    },
  };
}

export async function computeRouteStats(
  points: GpsArtPoint[],
  sport: OutdoorSport
): Promise<RouteStats | null> {
  const apiKey = getGoogleRoutesApiKey();
  if (!apiKey || points.length < 2) return null;

  const origin = points[0];
  const destination = points[points.length - 1];
  const intermediates = sampleWaypoints(points).map(latLng);

  const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
    },
    body: JSON.stringify({
      origin: latLng(origin),
      destination: latLng(destination),
      intermediates,
      travelMode: travelModeForSport(sport),
      routingPreference: "ROUTING_PREFERENCE_UNSPECIFIED",
      computeAlternativeRoutes: false,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  const data = (await response.json()) as ComputeRoutesResponse;
  if (!response.ok) {
    throw new Error(data.error?.message ?? "Google Routes API request failed.");
  }

  const route = data.routes?.[0];
  if (!route?.distanceMeters) return null;

  return {
    distanceKm: Math.round((route.distanceMeters / 1000) * 10) / 10,
    durationMin: Math.max(1, Math.round(parseDurationSeconds(route.duration) / 60)),
  };
}
