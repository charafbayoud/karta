import type { GpsArtPoint, OutdoorSport } from "@/types/gps-art";
import { decodePolyline } from "@/lib/google/polyline";
import { getGoogleRoutesApiKey } from "@/lib/google/keys";
import {
  createSeededRandom,
  pickRandomIndex,
  randomInt,
  shuffleWithSeed,
} from "@/lib/route-generator/random";
import type { StravaExploreSegment } from "@/lib/strava/segments";

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

function haversineKm(a: GpsArtPoint, b: GpsArtPoint): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

function pathDistanceKm(points: GpsArtPoint[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += haversineKm(points[i - 1], points[i]);
  }
  return total;
}

function parseDurationSeconds(duration: string | undefined): number {
  if (!duration) return 0;
  const match = duration.match(/(\d+)s/);
  return match ? Number(match[1]) : 0;
}

const DISTANCE_TOLERANCE_RATIO = 0.15;
const MAX_SEGMENT_PICKS = 5;
/** Straight-line loop path × this ≈ Google Routes loop distance. */
const ROAD_LOOP_FACTOR = 1.22;

function distanceFromStartKm(start: GpsArtPoint, segment: StravaExploreSegment): number {
  const coords = segment.start_latlng ?? segment.end_latlng;
  if (!coords) return Number.POSITIVE_INFINITY;
  return haversineKm(start, { lat: coords[0], lng: coords[1] });
}

function sortSegmentsByProximity(
  start: GpsArtPoint,
  segments: StravaExploreSegment[],
  offset: number
): StravaExploreSegment[] {
  return [...segments.slice(offset)].sort(
    (a, b) => distanceFromStartKm(start, a) - distanceFromStartKm(start, b)
  );
}

function distanceErrorKm(actualKm: number, targetKm: number): number {
  return Math.abs(actualKm - targetKm);
}

function isWithinDistanceTolerance(actualKm: number, targetKm: number): boolean {
  return distanceErrorKm(actualKm, targetKm) / targetKm <= DISTANCE_TOLERANCE_RATIO;
}

function loopPathDistanceKm(waypoints: GpsArtPoint[]): number {
  if (waypoints.length < 2) return 0;
  return pathDistanceKm([...waypoints, waypoints[0]]);
}

function pickSegmentWaypoints(
  start: GpsArtPoint,
  segments: StravaExploreSegment[],
  targetDistanceKm: number,
  offset = 0,
  pathScale = 1
): { waypoints: GpsArtPoint[]; segmentsUsed: StravaExploreSegment[] } {
  const pool = sortSegmentsByProximity(start, segments, offset);
  const picked: StravaExploreSegment[] = [];
  const targetPathKm = (targetDistanceKm / ROAD_LOOP_FACTOR) * pathScale;

  const waypoints: GpsArtPoint[] = [start];

  for (const segment of pool) {
    if (picked.length >= MAX_SEGMENT_PICKS) break;

    const end = segment.end_latlng;
    if (!end) continue;

    picked.push(segment);
    waypoints.push({ lat: end[0], lng: end[1] });

    if (loopPathDistanceKm(waypoints) >= targetPathKm) break;
  }

  if (waypoints.length === 1 && pool[0]?.start_latlng) {
    const first = pool[0].start_latlng;
    waypoints.push({ lat: first[0], lng: first[1] });
    if (picked.length === 0) picked.push(pool[0]);
  }

  waypoints.push(start);
  return { waypoints, segmentsUsed: picked };
}

function fallbackLoopWaypoints(
  start: GpsArtPoint,
  targetDistanceKm: number,
  variant = 0,
  bearingOffsetDeg = 0
): GpsArtPoint[] {
  // Square-ish loop: 4 equal legs ≈ target perimeter on roads.
  const legKm = targetDistanceKm / (4 * ROAD_LOOP_FACTOR);
  const deltaLat = legKm / 111;
  const deltaLng = deltaLat / Math.max(Math.cos((start.lat * Math.PI) / 180), 0.2);

  const corners = [
    { lat: start.lat + deltaLat, lng: start.lng },
    { lat: start.lat + deltaLat, lng: start.lng + deltaLng },
    { lat: start.lat, lng: start.lng + deltaLng },
    { lat: start.lat - deltaLat, lng: start.lng },
    { lat: start.lat - deltaLat, lng: start.lng - deltaLng },
    { lat: start.lat, lng: start.lng - deltaLng },
  ];

  const rotated = [...corners.slice(variant), ...corners.slice(0, variant)];

  if (bearingOffsetDeg === 0) {
    return [start, ...rotated.slice(0, 4), start];
  }

  const rad = (bearingOffsetDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const pivot = rotated.slice(0, 4).map((point) => {
    const dx = point.lng - start.lng;
    const dy = point.lat - start.lat;
    return {
      lat: start.lat + dy * cos - dx * sin,
      lng: start.lng + dy * sin + dx * cos,
    };
  });

  return [start, ...pivot, start];
}

function segmentSignature(segments: StravaExploreSegment[]): string {
  return segments.map((segment) => segment.id).join(",");
}

function waypointSignature(waypoints: GpsArtPoint[]): string {
  return waypoints.map((point) => `${point.lat.toFixed(4)},${point.lng.toFixed(4)}`).join("|");
}

export function getLoopVariantKey(
  segmentsUsed: StravaExploreSegment[],
  points: GpsArtPoint[]
): string {
  return segmentsUsed.length > 0
    ? segmentSignature(segmentsUsed)
    : waypointSignature(points);
}

function candidateKey(
  segmentsUsed: StravaExploreSegment[],
  waypoints: GpsArtPoint[]
): string {
  return getLoopVariantKey(segmentsUsed, waypoints);
}

function estimateLoopDistanceKm(
  _segmentsUsed: StravaExploreSegment[],
  waypoints: GpsArtPoint[]
): number {
  return loopPathDistanceKm(waypoints) * ROAD_LOOP_FACTOR;
}

function buildSegmentCandidates(
  start: GpsArtPoint,
  segments: StravaExploreSegment[],
  targetDistanceKm: number,
  random: () => number
): Array<{
  waypoints: GpsArtPoint[];
  segmentsUsed: StravaExploreSegment[];
  label: string;
}> {
  const configs: Array<{ offset: number; pathScale: number }> = [];
  const maxOffset = Math.min(segments.length, 12);

  for (let index = 0; index < maxOffset; index += 1) {
    configs.push({ offset: index, pathScale: 0.82 + random() * 0.22 });
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    configs.push({
      offset: randomInt(0, Math.max(0, segments.length - 1), random),
      pathScale: 0.82 + random() * 0.22,
    });
  }

  for (const pathScale of [0.85, 0.92, 1, 1.08]) {
    configs.push({ offset: 0, pathScale });
    if (segments.length > 1) configs.push({ offset: 1, pathScale });
    if (segments.length > 2) configs.push({ offset: 2, pathScale });
  }

  const shuffledConfigs = shuffleWithSeed(configs, random);
  const seen = new Set<string>();
  const candidates: Array<{
    waypoints: GpsArtPoint[];
    segmentsUsed: StravaExploreSegment[];
    label: string;
  }> = [];

  for (const config of shuffledConfigs) {
    const picked = pickSegmentWaypoints(
      start,
      segments,
      targetDistanceKm,
      config.offset,
      config.pathScale
    );
    if (picked.segmentsUsed.length === 0) continue;

    const key = candidateKey(picked.segmentsUsed, picked.waypoints);
    if (seen.has(key)) continue;
    seen.add(key);

    candidates.push({
      ...picked,
      label: routeLabel(picked.segmentsUsed, config.offset),
    });
  }

  return candidates.sort(
    (a, b) =>
      distanceErrorKm(
        estimateLoopDistanceKm(a.segmentsUsed, a.waypoints),
        targetDistanceKm
      ) -
      distanceErrorKm(
        estimateLoopDistanceKm(b.segmentsUsed, b.waypoints),
        targetDistanceKm
      )
  );
}

function routeLabel(segments: StravaExploreSegment[], index: number): string {
  if (segments.length === 0) {
    return `Circuit ${index + 1}`;
  }

  if (segments.length === 1) {
    return segments[0].name;
  }

  return segments
    .slice(0, 2)
    .map((segment) => segment.name)
    .join(" · ");
}

export async function routeLoopThroughWaypoints(
  waypoints: GpsArtPoint[],
  sport: OutdoorSport
): Promise<{ points: GpsArtPoint[]; distanceKm: number; durationMin: number }> {
  const apiKey = getGoogleRoutesApiKey();
  if (!apiKey || waypoints.length < 2) {
    const distanceKm = Math.round(pathDistanceKm(waypoints) * 10) / 10;
    return { points: waypoints, distanceKm, durationMin: Math.round(distanceKm * 4) };
  }

  const origin = waypoints[0];
  const destination = waypoints[waypoints.length - 1];
  const intermediates = waypoints.slice(1, -1).map(latLng);

  const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "routes.polyline.encodedPolyline,routes.distanceMeters,routes.duration",
    },
    body: JSON.stringify({
      origin: latLng(origin),
      destination: latLng(destination),
      intermediates,
      travelMode: travelModeForSport(sport),
      routingPreference: "ROUTING_PREFERENCE_UNSPECIFIED",
      computeAlternativeRoutes: false,
    }),
    signal: AbortSignal.timeout(20_000),
  });

  const data = (await response.json()) as {
    routes?: Array<{
      polyline?: { encodedPolyline?: string };
      distanceMeters?: number;
      duration?: string;
    }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(data.error?.message ?? "Google Routes loop failed.");
  }

  const route = data.routes?.[0];
  const encoded = route?.polyline?.encodedPolyline;
  const points = encoded ? decodePolyline(encoded) : waypoints;

  const distanceKm =
    route?.distanceMeters != null
      ? Math.round((route.distanceMeters / 1000) * 10) / 10
      : Math.round(pathDistanceKm(points) * 10) / 10;

  const durationMin =
    route?.duration != null
      ? Math.max(1, Math.round(parseDurationSeconds(route.duration) / 60))
      : Math.max(1, Math.round(distanceKm * (sport === "cycling" ? 3 : 6)));

  return { points, distanceKm, durationMin };
}

export type GeneratedLoop = {
  points: GpsArtPoint[];
  distanceKm: number;
  durationMin: number;
  segmentsUsed: StravaExploreSegment[];
  warning?: string;
  label: string;
  variantKey: string;
};

async function buildLoopVariant(input: {
  start: GpsArtPoint;
  sport: OutdoorSport;
  targetDistanceKm: number;
  segments: StravaExploreSegment[];
  waypoints: GpsArtPoint[];
  segmentsUsed: StravaExploreSegment[];
  warning?: string;
  label: string;
}): Promise<GeneratedLoop> {
  const routed = await routeLoopThroughWaypoints(input.waypoints, input.sport);

  return {
    ...routed,
    segmentsUsed: input.segmentsUsed,
    warning: input.warning,
    label: input.label,
    variantKey: getLoopVariantKey(input.segmentsUsed, routed.points),
  };
}

export async function generateLoopRoute(input: {
  start: GpsArtPoint;
  sport: OutdoorSport;
  targetDistanceKm: number;
  segments: StravaExploreSegment[];
  seed?: number;
  excludeKeys?: string[];
}): Promise<GeneratedLoop> {
  const variants = await generateLoopVariants(input);
  return variants.primary;
}

function selectLoopVariants(
  ranked: GeneratedLoop[],
  targetDistanceKm: number,
  excludeKeys: string[],
  random: () => number
): GeneratedLoop[] {
  const excluded = new Set(excludeKeys);
  const eligible = ranked.filter((loop) => !excluded.has(loop.variantKey));
  const pool = eligible.length > 0 ? eligible : ranked;

  const nearTarget = pool.filter((loop) =>
    isWithinDistanceTolerance(loop.distanceKm, targetDistanceKm)
  );
  const primaryPool = nearTarget.length > 0 ? nearTarget : pool;
  const sorted = [...primaryPool].sort(
    (a, b) =>
      distanceErrorKm(a.distanceKm, targetDistanceKm) -
      distanceErrorKm(b.distanceKm, targetDistanceKm)
  );
  const topPool = sorted.slice(0, Math.min(4, sorted.length));
  const primary = topPool[pickRandomIndex(topPool.length, random)];

  const selected: GeneratedLoop[] = [primary];
  const usedKeys = new Set<string>([primary.variantKey]);

  for (const loop of pool) {
    if (usedKeys.has(loop.variantKey)) continue;
    usedKeys.add(loop.variantKey);
    selected.push(loop);
    if (selected.length >= 4) break;
  }

  if (selected.length < 4) {
    for (const loop of ranked) {
      if (usedKeys.has(loop.variantKey)) continue;
      usedKeys.add(loop.variantKey);
      selected.push(loop);
      if (selected.length >= 4) break;
    }
  }

  return selected;
}

export async function generateLoopVariants(input: {
  start: GpsArtPoint;
  sport: OutdoorSport;
  targetDistanceKm: number;
  segments: StravaExploreSegment[];
  seed?: number;
  excludeKeys?: string[];
}): Promise<{ primary: GeneratedLoop; alternatives: GeneratedLoop[] }> {
  const seed = input.seed ?? Date.now();
  const random = createSeededRandom(seed);
  const shuffledSegments = shuffleWithSeed(input.segments, random);

  const candidates: Array<{
    waypoints: GpsArtPoint[];
    segmentsUsed: StravaExploreSegment[];
    warning?: string;
    label: string;
  }> = [];

  if (shuffledSegments.length === 0) {
    const variantCount = 6;
    const startVariant = randomInt(0, variantCount - 1, random);
    for (let index = 0; index < variantCount; index += 1) {
      const variant = (startVariant + index) % variantCount;
      candidates.push({
        waypoints: fallbackLoopWaypoints(
          input.start,
          input.targetDistanceKm,
          variant % 6,
          randomInt(0, 315, random)
        ),
        segmentsUsed: [],
        warning:
          index === 0
            ? "Aucun segment Strava trouvé ici — boucle générée via Google Routes uniquement."
            : undefined,
        label: `Boucle locale ${variant + 1}`,
      });
    }
  } else {
    candidates.push(
      ...buildSegmentCandidates(
        input.start,
        shuffledSegments,
        input.targetDistanceKm,
        random
      ).slice(0, 14)
    );
  }

  const built = await Promise.all(
    candidates.slice(0, shuffledSegments.length === 0 ? 6 : 14).map((candidate) =>
      buildLoopVariant({ ...input, segments: shuffledSegments, ...candidate })
    )
  );

  if (built.length === 0) {
    const fallback = await buildLoopVariant({
      ...input,
      segments: shuffledSegments,
      waypoints: fallbackLoopWaypoints(
        input.start,
        input.targetDistanceKm,
        randomInt(0, 5, random),
        randomInt(0, 315, random)
      ),
      segmentsUsed: [],
      warning: "Aucun segment Strava trouvé ici — boucle générée via Google Routes uniquement.",
      label: "Boucle locale",
    });
    return { primary: fallback, alternatives: [] };
  }

  const ranked = [...built].sort((a, b) => {
    const errorDiff =
      distanceErrorKm(a.distanceKm, input.targetDistanceKm) -
      distanceErrorKm(b.distanceKm, input.targetDistanceKm);
    if (errorDiff !== 0) return errorDiff;
    return a.label.localeCompare(b.label);
  });

  const selected = selectLoopVariants(
    ranked,
    input.targetDistanceKm,
    input.excludeKeys ?? [],
    random
  );

  const [primary, ...alternatives] = selected;

  return {
    primary,
    alternatives: alternatives.slice(0, 3),
  };
}
