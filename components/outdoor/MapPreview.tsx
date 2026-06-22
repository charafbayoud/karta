"use client";

import type { GpsArtPoint } from "@/types/gps-art";
import { GoogleMapView } from "./GoogleMapView";

export function MapPreview({ points }: { points: GpsArtPoint[] }) {
  const hasGoogleMaps = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  if (points.length === 0) {
    return <div className="map-preview map-preview-empty">Route preview</div>;
  }

  if (hasGoogleMaps) {
    const center = points[0];
    return (
      <GoogleMapView
        lat={center.lat}
        lng={center.lng}
        points={points}
        height={240}
      />
    );
  }

  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latSpan = Math.max(maxLat - minLat, 0.0001);
  const lngSpan = Math.max(maxLng - minLng, 0.0001);

  const svgPoints = points
    .map((point) => {
      const x = ((point.lng - minLng) / lngSpan) * 280 + 10;
      const y = ((maxLat - point.lat) / latSpan) * 160 + 10;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="map-preview">
      <svg viewBox="0 0 300 180" role="img" aria-label="Generated route map preview">
        <rect x="0" y="0" width="300" height="180" fill="#F2F0EB" />
        <polyline
          points={svgPoints}
          fill="none"
          stroke="#C4622D"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <p className="map-preview-caption font-data">
        {points[0].lat.toFixed(5)}, {points[0].lng.toFixed(5)}
      </p>
    </div>
  );
}
