import type { GpsArtPoint } from "@/types/gps-art";
import { encodePolyline, subsamplePoints } from "@/lib/google/polyline";
import { getGoogleMapsApiKey } from "@/lib/google/keys";

export function buildStaticMapUrlFromStrokes(
  strokes: GpsArtPoint[][],
  apiKey: string,
  size = "640x640"
): string {
  const points = strokes.flat();
  if (points.length < 2) {
    throw new Error("Not enough points for static map.");
  }

  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  const padding = 0.08;
  const latSpan = Math.max(Math.max(...lats) - Math.min(...lats), 0.0005);
  const lngSpan = Math.max(Math.max(...lngs) - Math.min(...lngs), 0.0005);
  const minLat = Math.min(...lats) - latSpan * padding;
  const maxLat = Math.max(...lats) + latSpan * padding;
  const minLng = Math.min(...lngs) - lngSpan * padding;
  const maxLng = Math.max(...lngs) + lngSpan * padding;

  const url = new URL("https://maps.googleapis.com/maps/api/staticmap");
  url.searchParams.set("size", size);
  url.searchParams.set("scale", "2");
  url.searchParams.set("maptype", "roadmap");

  for (const stroke of strokes) {
    if (stroke.length < 2) continue;
    const sampled = subsamplePoints(stroke, 80);
    url.searchParams.append(
      "path",
      `weight:5|color:0xC4622DFF|enc:${encodePolyline(sampled)}`
    );
  }

  url.searchParams.set("visible", `${minLat},${minLng}|${maxLat},${maxLng}`);
  url.searchParams.set("style", "feature:poi|visibility:off");
  url.searchParams.set("key", apiKey);

  return url.toString();
}

export function buildStaticMapUrl(
  points: GpsArtPoint[],
  apiKey: string,
  size = "640x640"
): string {
  const sampled = subsamplePoints(points, 120);
  const encoded = encodePolyline(sampled);

  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  const padding = 0.08;
  const latSpan = Math.max(Math.max(...lats) - Math.min(...lats), 0.0005);
  const lngSpan = Math.max(Math.max(...lngs) - Math.min(...lngs), 0.0005);
  const minLat = Math.min(...lats) - latSpan * padding;
  const maxLat = Math.max(...lats) + latSpan * padding;
  const minLng = Math.min(...lngs) - lngSpan * padding;
  const maxLng = Math.max(...lngs) + lngSpan * padding;

  const url = new URL("https://maps.googleapis.com/maps/api/staticmap");
  url.searchParams.set("size", size);
  url.searchParams.set("scale", "2");
  url.searchParams.set("maptype", "roadmap");
  url.searchParams.set(
    "path",
    `weight:5|color:0xC4622DFF|enc:${encoded}`
  );
  url.searchParams.set(
    "visible",
    `${minLat},${minLng}|${maxLat},${maxLng}`
  );
  url.searchParams.set("style", "feature:poi|visibility:off");
  url.searchParams.set("key", apiKey);

  return url.toString();
}

export function isStaticMapConfigured(): boolean {
  return getGoogleMapsApiKey() !== null;
}
