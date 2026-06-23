"use client";

import { useEffect, useMemo, useState } from "react";
import type { GpsArtResult } from "@/types/gps-art";

export function ShareImageCard({ result }: { result: GpsArtResult }) {
  const shapeStrokes = useMemo(
    () => result.shapeStrokes ?? (result.shapePoints ? [result.shapePoints] : []),
    [result.shapePoints, result.shapeStrokes]
  );
  const shapeKey = useMemo(
    () =>
      `${result.routeName}|${shapeStrokes.length}|${shapeStrokes[0]?.[0]?.lat ?? 0}|${shapeStrokes[0]?.[0]?.lng ?? 0}`,
    [result.routeName, shapeStrokes]
  );
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    async function loadMapCapture() {
      setLoading(true);
      setError("");
      setMapImageUrl(null);

      try {
        const response = await fetch("/api/gps-art/share-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shapeStrokes }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error ?? "Unable to load map capture.");
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          setMapImageUrl(objectUrl);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Map capture failed.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMapCapture();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [shapeKey, shapeStrokes]);

  async function downloadImage() {
    if (!mapImageUrl) return;

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#FAFAF7";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#1A1A1A";
      ctx.font = "600 52px Georgia, serif";
      ctx.fillText("KARTA", 48, 72);

      ctx.font = "400 30px Helvetica, Arial, sans-serif";
      ctx.fillStyle = "#6B6860";
      ctx.fillText(result.shapeLabel, 48, 118);

      const mapSize = 984;
      const mapX = 48;
      const mapY = 150;
      ctx.drawImage(image, mapX, mapY, mapSize, mapSize);

      ctx.strokeStyle = "#DDD9D1";
      ctx.lineWidth = 2;
      ctx.strokeRect(mapX, mapY, mapSize, mapSize);

      ctx.font = "400 24px Courier, monospace";
      ctx.fillStyle = "#2C2C2C";
      ctx.fillText(
        `${result.distanceKm} km · ~${result.durationMin} min · GPS Art`,
        48,
        1280
      );

      ctx.font = "400 20px Helvetica, Arial, sans-serif";
      ctx.fillStyle = "#6B6860";
      ctx.fillText("karta.club", 48, 1318);

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;
        const pngUrl = URL.createObjectURL(pngBlob);
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `${result.routeName.replace(/\s+/g, "-").toLowerCase()}-share.png`;
        link.click();
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
    };

    image.src = mapImageUrl;
  }

  return (
    <div className="share-card">
      <p className="karta-label">Share preview</p>

      {loading && <p className="outdoor-hint">Generating map capture…</p>}
      {error && <p className="auth-error">{error}</p>}

      {mapImageUrl && !error && (
        <img
          src={mapImageUrl}
          alt={`Map capture of ${result.shapeLabel}`}
          className="share-card-map"
        />
      )}

      <p className="outdoor-hint">
        Forme exacte en aperçu — GPX calé sur les routes pour ta sortie.
      </p>

      <button
        type="button"
        className="btn-secondary"
        onClick={downloadImage}
        disabled={!mapImageUrl || loading}
      >
        Download share image
      </button>
    </div>
  );
}
