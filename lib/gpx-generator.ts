import type { GpsArtPoint } from "@/types/gps-art";
import { densifyPathForGpx } from "@/lib/google/densify";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function trackpointsFromPoints(points: GpsArtPoint[]): string {
  return points
    .map(
      (point) =>
        `      <trkpt lat="${point.lat.toFixed(7)}" lon="${point.lng.toFixed(7)}"><ele>0</ele></trkpt>`
    )
    .join("\n");
}

export function generateGpx(
  name: string,
  points: GpsArtPoint[],
  sport: "cycling" | "running" | "walking"
): string {
  const type = sport === "cycling" ? "Biking" : sport === "running" ? "Running" : "Walking";

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="KARTA" version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(name)}</name>
  </metadata>
  <trk>
    <name>${escapeXml(name)}</name>
    <type>${type}</type>
    <trkseg>
${trackpointsFromPoints(points)}
    </trkseg>
  </trk>
</gpx>`;
}

/** One GPX track segment per stroke — no lines between letter strokes. */
export function generateGpxFromStrokes(
  name: string,
  strokes: GpsArtPoint[][],
  sport: "cycling" | "running" | "walking",
  spacingMeters = 6
): string {
  const type = sport === "cycling" ? "Biking" : sport === "running" ? "Running" : "Walking";
  const segments = strokes
    .filter((stroke) => stroke.length >= 2)
    .map((stroke) => {
      const dense = densifyPathForGpx(stroke, spacingMeters);
      return `    <trkseg>\n${trackpointsFromPoints(dense)}\n    </trkseg>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="KARTA" version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(name)}</name>
  </metadata>
  <trk>
    <name>${escapeXml(name)}</name>
    <type>${type}</type>
${segments}
  </trk>
</gpx>`;
}
