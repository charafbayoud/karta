import type { GpsArtPoint, OutdoorSport } from "@/types/gps-art";
import { isGoogleRoutesConfigured } from "@/lib/google/keys";
import { snapStartToNearestRoad, snapStrokeVertices } from "@/lib/google/roads";
import { routeSegmentOnRoads } from "@/lib/google/shape-on-roads";

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

/** Snap departure to the nearest road before placing the shape. */
export async function snapStartToRoad(start: GpsArtPoint): Promise<GpsArtPoint> {
  return snapStartToNearestRoad(start);
}

/**
 * Route one letter stroke: snap corners to roads, then route each straight segment
 * via Google Routes (rideable path, avoids water).
 */
export async function routeLetterStroke(
  stroke: GpsArtPoint[],
  sport: OutdoorSport
): Promise<GpsArtPoint[]> {
  if (stroke.length < 2) return stroke;

  if (!isGoogleRoutesConfigured()) {
    throw new Error("Google Routes is not configured.");
  }

  const anchors = await snapStrokeVertices(stroke);
  if (anchors.length < 2) {
    throw new Error("Ce trait est trop loin d'une route praticable.");
  }

  const routed: GpsArtPoint[] = [];

  for (let i = 0; i < anchors.length - 1; i += 1) {
    const segment = await routeSegmentOnRoads(anchors[i], anchors[i + 1], sport);
    if (segment.length < 2) {
      throw new Error("Impossible de router un segment de la lettre sur une route praticable.");
    }
    appendPoints(routed, segment);
  }

  if (routed.length < 2) {
    throw new Error("Ce trait n'a produit aucun chemin praticable.");
  }

  return routed;
}

export async function routeAllStrokes(
  strokes: GpsArtPoint[][],
  sport: OutdoorSport
): Promise<GpsArtPoint[][]> {
  const routed: GpsArtPoint[][] = [];

  for (const stroke of strokes) {
    if (stroke.length < 2) continue;
    routed.push(await routeLetterStroke(stroke, sport));
  }

  if (routed.length === 0) {
    throw new Error("Aucun trait routable n'a pu être généré.");
  }

  return routed;
}
