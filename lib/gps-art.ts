import { generateGpxFromStrokes } from "@/lib/gpx-generator";
import {
  buildAlphabetPreviewStrokes,
  buildAlphabetStrokes,
} from "@/lib/gps-art/alphabet";
import { routeAllStrokes, snapStartToRoad } from "@/lib/gps-art/route-strokes";
import { densifyPathForGpx } from "@/lib/google/densify";
import {
  isGoogleRoadsConfigured,
  isGoogleRoutesConfigured,
} from "@/lib/google/keys";
import { verifyStrokesSnapToRoads } from "@/lib/google/roads";
import { withTimeout } from "@/lib/google/timeout";
import type {
  GpsArtDistance,
  GpsArtPoint,
  GpsArtRequest,
  GpsArtResult,
  OutdoorSport,
} from "@/types/gps-art";
import { GPS_ART_MAX_LETTERS } from "@/types/gps-art";

type TemplatePoint = { x: number; y: number };

export {
  buildAlphabetPreviewStrokes,
  buildAlphabetPreviewTemplate,
  buildAlphabetStrokes,
  buildAlphabetTemplate,
  getLetterStrokeSvgPolylines,
  getLetterStrokes,
  getLetterTemplate,
  getLetterTemplateSvg,
  GPS_ART_ALPHABET,
} from "@/lib/gps-art/alphabet";
export type { TemplatePoint } from "@/lib/gps-art/template-point";

function strokePathLength(strokes: TemplatePoint[][]): number {
  let total = 0;
  for (const stroke of strokes) {
    for (let i = 1; i < stroke.length; i += 1) {
      total += Math.hypot(stroke[i].x - stroke[i - 1].x, stroke[i].y - stroke[i - 1].y);
    }
  }
  return total;
}

function templateCentroid(strokes: TemplatePoint[][]): TemplatePoint {
  const points = strokes.flat();
  const total = points.reduce(
    (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
    { x: 0, y: 0 }
  );
  return { x: total.x / points.length, y: total.y / points.length };
}

function templateBBoxSpan(strokes: TemplatePoint[][]): number {
  const points = strokes.flat();
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return Math.max(
    Math.max(...xs) - Math.min(...xs),
    Math.max(...ys) - Math.min(...ys),
    0.001
  );
}

function maxGeographicSpanMeters(letterCount: number, targetKm: GpsArtDistance): number {
  // Keep all letter corners within rideable road density near the start.
  const byLetters = 900 + letterCount * 450;
  const byTarget = targetKm * 1000 * 0.22;
  return Math.min(3200, Math.max(800, Math.min(byLetters, byTarget)));
}

function strokesToGps(
  strokes: TemplatePoint[][],
  startLat: number,
  startLng: number,
  targetKm: GpsArtDistance,
  letterCount: number,
  scaleFactor = 1
): GpsArtPoint[][] {
  const centroid = templateCentroid(strokes);
  const unitLength = strokePathLength(strokes);
  const targetMeters = targetKm * 1000;
  const scaleByLength = (targetMeters / Math.max(unitLength, 0.001)) * scaleFactor;
  const scaleBySpan =
    (maxGeographicSpanMeters(letterCount, targetKm) / templateBBoxSpan(strokes)) * scaleFactor;
  const scale = Math.min(scaleByLength, scaleBySpan);
  const latScale = scale / 111_320;
  const lngScale = scale / (111_320 * Math.max(Math.cos((startLat * Math.PI) / 180), 0.2));

  return strokes.map((stroke) =>
    stroke.map((point) => ({
      lat: startLat + (point.y - centroid.y) * latScale,
      lng: startLng + (point.x - centroid.x) * lngScale,
    }))
  );
}

async function fitShapeToRoads(
  templateStrokes: TemplatePoint[][],
  origin: GpsArtPoint,
  targetKm: GpsArtDistance,
  letterCount: number
): Promise<GpsArtPoint[][]> {
  let scaleFactor = 1;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = strokesToGps(
      templateStrokes,
      origin.lat,
      origin.lng,
      targetKm,
      letterCount,
      scaleFactor
    );

    try {
      await verifyStrokesSnapToRoads(candidate);
      return candidate;
    } catch {
      scaleFactor *= 0.82;
    }
  }

  throw new Error(
    "Impossible de placer les lettres sur des routes près du départ. Choisis un départ en centre-ville ou réduis le nombre de lettres."
  );
}

function flattenStrokes(strokes: GpsArtPoint[][]): GpsArtPoint[] {
  return strokes.flat();
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
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function totalStrokeDistanceKm(strokes: GpsArtPoint[][]): number {
  let total = 0;
  for (const stroke of strokes) {
    for (let i = 1; i < stroke.length; i += 1) {
      total += haversineKm(stroke[i - 1], stroke[i]);
    }
  }
  return total;
}

function estimateDurationMin(distanceKm: number, sport: OutdoorSport): number {
  const speeds: Record<OutdoorSport, number> = {
    cycling: 22,
    running: 10,
    walking: 5,
  };
  return Math.round((distanceKm / speeds[sport]) * 60);
}

function shapeStrokesForPreview(strokes: GpsArtPoint[][]): GpsArtPoint[][] {
  return strokes.map((stroke) => densifyPathForGpx(stroke, 12, 4000));
}

function buildPreviewResult(
  request: GpsArtRequest,
  shapeStrokes: GpsArtPoint[][]
): Pick<
  GpsArtResult,
  | "routeName"
  | "shapeLabel"
  | "sport"
  | "shapeStrokes"
  | "shapePoints"
  | "warning"
> {
  const previewStrokes = shapeStrokesForPreview(shapeStrokes);
  const shapePoints = flattenStrokes(previewStrokes);
  const shapeDistance = totalStrokeDistanceKm(shapeStrokes);
  const shapeLabel = `Your ${request.text.toUpperCase()} route`;
  const routeName = `${shapeLabel} — ${request.distanceKm} km target`;

  const warning =
    shapeDistance < request.distanceKm * 0.55
      ? `Forme compactée près du départ (${Math.round(shapeDistance * 10) / 10} km routables) pour rester sur les routes.`
      : undefined;

  return {
    routeName,
    shapeLabel,
    sport: request.sport,
    shapeStrokes: previewStrokes,
    shapePoints,
    warning,
  };
}

async function buildRoutedResult(request: GpsArtRequest): Promise<GpsArtResult> {
  if (!isGoogleRoutesConfigured()) {
    throw new Error(
      "Google Routes indisponible. Configure GOOGLE_ROUTES_API_KEY (clé serveur) pour générer un GPX praticable."
    );
  }

  if (!isGoogleRoadsConfigured()) {
    throw new Error(
      "Google Roads indisponible. Configure GOOGLE_ROADS_API_KEY (clé serveur) pour accrocher les lettres aux routes."
    );
  }

  const templateStrokes = buildAlphabetStrokes(request.text);
  if (templateStrokes.length === 0) {
    throw new Error(`Choose 1 to ${GPS_ART_MAX_LETTERS} letters (A–Z).`);
  }

  const letterCount = request.text.toUpperCase().replace(/[^A-Z]/g, "").length;
  const origin = await snapStartToRoad(request.start);
  const shapeStrokes = await fitShapeToRoads(
    templateStrokes,
    origin,
    request.distanceKm,
    letterCount
  );
  const routedStrokes = await routeAllStrokes(shapeStrokes, request.sport);
  const routeDistance = totalStrokeDistanceKm(routedStrokes);
  const preview = buildPreviewResult(request, shapeStrokes);
  const routeGpx = generateGpxFromStrokes(preview.routeName, routedStrokes, request.sport, 6);

  return {
    ...preview,
    distanceKm: Math.round(routeDistance * 10) / 10,
    durationMin: estimateDurationMin(routeDistance, request.sport),
    elevationM: Math.round(routeDistance * 8),
    routeStrokes: routedStrokes,
    routePoints: flattenStrokes(routedStrokes),
    points: flattenStrokes(routedStrokes),
    gpx: routeGpx,
    routeGpx,
    snappedToRoads: true,
  };
}

export function getAlphabetTemplatePreview(text: string): TemplatePoint[] {
  return buildAlphabetPreviewStrokes(text).flat();
}

/** Sync helper — preview geometry only, never used for GPX export. */
export function generateGpsArtRoute(request: GpsArtRequest): GpsArtResult {
  const templateStrokes = buildAlphabetStrokes(request.text);
  if (templateStrokes.length === 0) {
    throw new Error(`Choose 1 to ${GPS_ART_MAX_LETTERS} letters (A–Z).`);
  }

  const letterCount = request.text.toUpperCase().replace(/[^A-Z]/g, "").length;
  const shapeStrokes = strokesToGps(
    templateStrokes,
    request.start.lat,
    request.start.lng,
    request.distanceKm,
    letterCount
  );
  const preview = buildPreviewResult(request, shapeStrokes);

  return {
    ...preview,
    distanceKm: Math.round(totalStrokeDistanceKm(shapeStrokes) * 10) / 10,
    durationMin: estimateDurationMin(totalStrokeDistanceKm(shapeStrokes), request.sport),
    elevationM: Math.round(totalStrokeDistanceKm(shapeStrokes) * 8),
    routeStrokes: [],
    routePoints: [],
    points: [],
    gpx: "",
    routeGpx: "",
  };
}

export async function generateGpsArtRouteAsync(
  request: GpsArtRequest
): Promise<GpsArtResult> {
  return withTimeout(buildRoutedResult(request), 120_000, "Street routing");
}
