import type { GpsArtPoint } from "@/types/gps-art";

function haversineMeters(a: GpsArtPoint, b: GpsArtPoint): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 6371_000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function interpolate(a: GpsArtPoint, b: GpsArtPoint, ratio: number): GpsArtPoint {
  return {
    lat: a.lat + (b.lat - a.lat) * ratio,
    lng: a.lng + (b.lng - a.lng) * ratio,
  };
}

function subsample(points: GpsArtPoint[], maxPoints: number): GpsArtPoint[] {
  if (points.length <= maxPoints) return points;

  const sampled: GpsArtPoint[] = [];
  for (let i = 0; i < maxPoints; i += 1) {
    sampled.push(points[Math.round((i * (points.length - 1)) / (maxPoints - 1))]);
  }
  return sampled;
}

/** Add points along a path so Roads API gets enough detail (~every N meters). */
export function densifyPath(
  points: GpsArtPoint[],
  spacingMeters = 80,
  maxPoints = 90
): GpsArtPoint[] {
  if (points.length < 2) return points;

  const dense: GpsArtPoint[] = [points[0]];

  for (let i = 1; i < points.length; i += 1) {
    const start = points[i - 1];
    const end = points[i];
    const segmentMeters = haversineMeters(start, end);
    const steps = Math.max(1, Math.ceil(segmentMeters / spacingMeters));

    for (let step = 1; step <= steps; step += 1) {
      dense.push(interpolate(start, end, step / steps));
    }
  }

  return subsample(dense, maxPoints);
}

/** Dense trackpoints for GPX export (~every N meters, no aggressive subsampling). */
export function densifyPathForGpx(
  points: GpsArtPoint[],
  spacingMeters = 8,
  maxPoints = 12_000
): GpsArtPoint[] {
  if (points.length < 2) return points;

  const dense: GpsArtPoint[] = [points[0]];

  for (let i = 1; i < points.length; i += 1) {
    const start = points[i - 1];
    const end = points[i];
    const segmentMeters = haversineMeters(start, end);
    const steps = Math.max(1, Math.ceil(segmentMeters / spacingMeters));

    for (let step = 1; step <= steps; step += 1) {
      dense.push(interpolate(start, end, step / steps));
    }
  }

  return subsample(dense, maxPoints);
}
