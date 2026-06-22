import type { GpsArtPoint } from "@/types/gps-art";

/** Decode Google's encoded polyline format. */
export function decodePolyline(encoded: string): GpsArtPoint[] {
  const points: GpsArtPoint[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return points;
}

function encodeSigned(value: number): string {
  let signed = value < 0 ? ~(value << 1) : value << 1;
  let output = "";

  while (signed >= 0x20) {
    output += String.fromCharCode((0x20 | (signed & 0x1f)) + 63);
    signed >>= 5;
  }

  output += String.fromCharCode(signed + 63);
  return output;
}

export function encodePolyline(points: GpsArtPoint[]): string {
  let lastLat = 0;
  let lastLng = 0;
  let encoded = "";

  for (const point of points) {
    const lat = Math.round(point.lat * 1e5);
    const lng = Math.round(point.lng * 1e5);
    encoded += encodeSigned(lat - lastLat);
    encoded += encodeSigned(lng - lastLng);
    lastLat = lat;
    lastLng = lng;
  }

  return encoded;
}

export function subsamplePoints(points: GpsArtPoint[], maxPoints: number): GpsArtPoint[] {
  if (points.length <= maxPoints) return points;

  const sampled: GpsArtPoint[] = [];
  for (let i = 0; i < maxPoints; i += 1) {
    sampled.push(points[Math.round((i * (points.length - 1)) / (maxPoints - 1))]);
  }
  return sampled;
}
