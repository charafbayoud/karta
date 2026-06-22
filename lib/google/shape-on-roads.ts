import type { GpsArtPoint, OutdoorSport } from "@/types/gps-art";
import { decodePolyline } from "@/lib/google/polyline";
import { getGoogleRoutesApiKey } from "@/lib/google/keys";

type SegmentResponse = {
  routes?: Array<{
    polyline?: { encodedPolyline?: string };
  }>;
  error?: { message?: string };
};

const MAX_INTERMEDIATES = 25;
const MAX_WAYPOINTS_PER_REQUEST = MAX_INTERMEDIATES + 2;

function travelModeForSport(sport: OutdoorSport): string {
  if (sport === "cycling") return "BICYCLE";
  return "WALK";
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

function appendPoints(target: GpsArtPoint[], chunk: GpsArtPoint[]) {
  for (const point of chunk) {
    const last = target[target.length - 1];
    if (
      last &&
      Math.abs(last.lat - point.lat) < 0.000001 &&
      Math.abs(last.lng - point.lng) < 0.000001
    ) {
      continue;
    }
    target.push(point);
  }
}

function sampleAnchors(points: GpsArtPoint[], maxAnchors: number): GpsArtPoint[] {
  if (points.length <= maxAnchors) return [...points];

  const sampled: GpsArtPoint[] = [];
  for (let i = 0; i < maxAnchors; i += 1) {
    sampled.push(points[Math.round((i * (points.length - 1)) / (maxAnchors - 1))]);
  }
  return sampled;
}

async function routeWaypointsStrict(
  waypoints: GpsArtPoint[],
  sport: OutdoorSport
): Promise<GpsArtPoint[]> {
  if (waypoints.length < 2) return waypoints;

  const apiKey = getGoogleRoutesApiKey();
  if (!apiKey) {
    throw new Error("Google Routes is not configured.");
  }

  const origin = waypoints[0];
  const destination = waypoints[waypoints.length - 1];
  const intermediates = waypoints.slice(1, -1).map(latLng);

  const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
    },
    body: JSON.stringify({
      origin: latLng(origin),
      destination: latLng(destination),
      intermediates,
      travelMode: travelModeForSport(sport),
      routingPreference: "ROUTING_PREFERENCE_UNSPECIFIED",
      computeAlternativeRoutes: false,
    }),
    signal: AbortSignal.timeout(12_000),
  });

  const data = (await response.json()) as SegmentResponse;
  if (!response.ok) {
    throw new Error(data.error?.message ?? "Google Routes segment failed.");
  }

  const encoded = data.routes?.[0]?.polyline?.encodedPolyline;
  if (!encoded) {
    throw new Error("Aucun itinéraire praticable entre deux points de la lettre.");
  }

  return decodePolyline(encoded);
}

async function routeWaypoints(
  waypoints: GpsArtPoint[],
  sport: OutdoorSport
): Promise<GpsArtPoint[]> {
  if (waypoints.length < 2) return waypoints;

  const apiKey = getGoogleRoutesApiKey();
  if (!apiKey) return waypoints;

  const origin = waypoints[0];
  const destination = waypoints[waypoints.length - 1];
  const intermediates = waypoints.slice(1, -1).map(latLng);

  const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
    },
    body: JSON.stringify({
      origin: latLng(origin),
      destination: latLng(destination),
      intermediates,
      travelMode: travelModeForSport(sport),
      routingPreference: "ROUTING_PREFERENCE_UNSPECIFIED",
      computeAlternativeRoutes: false,
    }),
    signal: AbortSignal.timeout(12_000),
  });

  const data = (await response.json()) as SegmentResponse;
  if (!response.ok) {
    throw new Error(data.error?.message ?? "Google Routes segment failed.");
  }

  const encoded = data.routes?.[0]?.polyline?.encodedPolyline;
  if (!encoded) return waypoints;

  return decodePolyline(encoded);
}

/** Route between two snapped anchors on real streets. Throws if unroutable. */
export async function routeSegmentOnRoads(
  origin: GpsArtPoint,
  destination: GpsArtPoint,
  sport: OutdoorSport
): Promise<GpsArtPoint[]> {
  return routeWaypointsStrict([origin, destination], sport);
}

/** Route an open stroke on real streets (no loop back to start). */
export async function routeStrokeOnRoads(
  strokePoints: GpsArtPoint[],
  sport: OutdoorSport,
  maxAnchors = 28
): Promise<GpsArtPoint[]> {
  if (strokePoints.length < 2) return strokePoints;

  const anchors = sampleAnchors(strokePoints, maxAnchors);
  const routed: GpsArtPoint[] = [];

  let startIdx = 0;
  while (startIdx < anchors.length - 1) {
    const endIdx = Math.min(startIdx + MAX_WAYPOINTS_PER_REQUEST - 1, anchors.length - 1);
    const chunk = anchors.slice(startIdx, endIdx + 1);
    const segment = await routeWaypoints(chunk, sport);
    appendPoints(routed, segment);

    if (endIdx >= anchors.length - 1) break;
    startIdx = endIdx;
  }

  return routed.length > 1 ? routed : strokePoints;
}

/** Route through shape anchors on real streets, preserving outline detail. */
export async function routeShapeOnRoads(
  shapePoints: GpsArtPoint[],
  sport: OutdoorSport,
  maxAnchors = 48
): Promise<GpsArtPoint[]> {
  if (shapePoints.length < 2) return shapePoints;

  const anchors = sampleAnchors(shapePoints, maxAnchors);
  const loop = [...anchors, anchors[0]];
  const routed: GpsArtPoint[] = [];

  let startIdx = 0;
  while (startIdx < loop.length - 1) {
    const endIdx = Math.min(startIdx + MAX_WAYPOINTS_PER_REQUEST - 1, loop.length - 1);
    const chunk = loop.slice(startIdx, endIdx + 1);
    const segment = await routeWaypoints(chunk, sport);
    appendPoints(routed, segment);

    if (endIdx >= loop.length - 1) break;
    startIdx = endIdx;
  }

  return routed.length > 1 ? routed : shapePoints;
}

export function anchorCountForOutline(outlineLength: number): number {
  return Math.min(56, Math.max(34, Math.round(outlineLength * 0.42)));
}
