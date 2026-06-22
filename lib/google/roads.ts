import type { GpsArtPoint } from "@/types/gps-art";
import { getGoogleRoadsApiKey } from "@/lib/google/keys";

const BATCH_SIZE = 100;

type SnapResponse = {
  snappedPoints?: Array<{
    location: { latitude: number; longitude: number };
    originalIndex?: number;
  }>;
  error?: { message?: string };
};

function haversineMeters(a: GpsArtPoint, b: GpsArtPoint): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function offsetMeters(origin: GpsArtPoint, meters: number, bearingDeg: number): GpsArtPoint {
  const earthRadius = 6371000;
  const bearing = (bearingDeg * Math.PI) / 180;
  const lat1 = (origin.lat * Math.PI) / 180;
  const lng1 = (origin.lng * Math.PI) / 180;
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(meters / earthRadius) +
      Math.cos(lat1) * Math.sin(meters / earthRadius) * Math.cos(bearing)
  );
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(meters / earthRadius) * Math.cos(lat1),
      Math.cos(meters / earthRadius) - Math.sin(lat1) * Math.sin(lat2)
    );
  return { lat: (lat2 * 180) / Math.PI, lng: (lng2 * 180) / Math.PI };
}

function dedupeConsecutive(points: GpsArtPoint[]): GpsArtPoint[] {
  const deduped: GpsArtPoint[] = [];
  for (const point of points) {
    const last = deduped[deduped.length - 1];
    if (last && haversineMeters(last, point) < 3) continue;
    deduped.push(point);
  }
  return deduped;
}

async function fetchSnapBatch(
  batch: GpsArtPoint[],
  interpolate: boolean
): Promise<GpsArtPoint[]> {
  const apiKey = getGoogleRoadsApiKey();
  if (!apiKey) {
    throw new Error("Google Roads is not configured.");
  }

  const path = batch.map((point) => `${point.lat},${point.lng}`).join("|");
  const url = new URL("https://roads.googleapis.com/v1/snapToRoads");
  url.searchParams.set("path", path);
  url.searchParams.set("interpolate", interpolate ? "true" : "false");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), { signal: AbortSignal.timeout(15_000) });
  const data = (await response.json()) as SnapResponse;

  if (!response.ok) {
    const message = data.error?.message ?? "Google Roads API request failed.";
    if (message.includes("referer") || message.includes("API key")) {
      throw new Error(
        "Google Roads blocked — configure GOOGLE_ROADS_API_KEY (server key, not referrer-restricted)."
      );
    }
    throw new Error(message);
  }

  return (data.snappedPoints ?? []).map((point) => ({
    lat: point.location.latitude,
    lng: point.location.longitude,
  }));
}

/** Snap one point to the nearest road. Returns null if Google cannot snap it. */
export async function snapVertexToRoad(point: GpsArtPoint): Promise<GpsArtPoint | null> {
  const snapped = await fetchSnapBatch([point], false);
  return snapped[0] ?? null;
}

/**
 * Snap departure: try exact pin, then search in widening rings (park, plaza, river bank…).
 */
export async function snapStartToNearestRoad(start: GpsArtPoint): Promise<GpsArtPoint> {
  const direct = await snapVertexToRoad(start);
  if (direct) return direct;

  const ringsMeters = [35, 70, 120, 200];
  const bearings = [0, 45, 90, 135, 180, 225, 270, 315];

  for (const radius of ringsMeters) {
    for (const bearing of bearings) {
      const candidate = offsetMeters(start, radius, bearing);
      const snapped = await snapVertexToRoad(candidate);
      if (snapped) return snapped;
    }
  }

  throw new Error(
    "Aucune route praticable à proximité. Zoome sur la carte et clique directement sur une rue ou un chemin."
  );
}

export type SnapOptions = {
  interpolate?: boolean;
  /** When true, throw instead of returning unsnapped input points. */
  strict?: boolean;
};

export async function snapPointsToRoads(
  points: GpsArtPoint[],
  options: SnapOptions = {}
): Promise<GpsArtPoint[]> {
  const { interpolate = false, strict = false } = options;
  const apiKey = getGoogleRoadsApiKey();

  if (!apiKey || points.length === 0) {
    if (strict) throw new Error("Google Roads is not configured.");
    return points;
  }

  const snapped: GpsArtPoint[] = [];

  for (let index = 0; index < points.length; index += BATCH_SIZE) {
    const batch = points.slice(index, index + BATCH_SIZE);
    const batchSnapped = await fetchSnapBatch(batch, interpolate);
    snapped.push(...batchSnapped);
  }

  if (strict) {
    if (snapped.length < points.length) {
      throw new Error(
        `${points.length - snapped.length} sommet(s) de la lettre sont trop loin d'une route praticable.`
      );
    }
    return dedupeConsecutive(snapped);
  }

  return snapped.length > 0 ? dedupeConsecutive(snapped) : points;
}

/** Snap each stroke corner individually — one anchor per template vertex. */
export async function snapStrokeVertices(stroke: GpsArtPoint[]): Promise<GpsArtPoint[]> {
  const snapped: GpsArtPoint[] = [];

  for (const vertex of stroke) {
    const point = await snapVertexToRoad(vertex);
    if (!point) {
      throw new Error(
        "Un coin de la lettre tombe hors route (eau, parc sans chemin…). Déplace le départ en ville ou réduis la distance."
      );
    }
    snapped.push(point);
  }

  return dedupeConsecutive(snapped);
}

/** Verify every vertex in all strokes can snap to a road before routing. */
export async function verifyStrokesSnapToRoads(strokes: GpsArtPoint[][]): Promise<void> {
  for (const stroke of strokes) {
    if (stroke.length < 2) continue;
    await snapStrokeVertices(stroke);
  }
}
