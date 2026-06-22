"use client";

import { buildAlphabetPreviewStrokes } from "@/lib/gps-art";
import { strokesToSvgPolylines } from "@/lib/gps-art/template-point";

export function ShapePreview({ text }: { text?: string }) {
  const strokes = text ? buildAlphabetPreviewStrokes(text) : [];

  if (strokes.length === 0) {
    return <div className="shape-preview shape-preview-empty">Select a shape</div>;
  }

  const polylines = strokesToSvgPolylines(strokes, 180, 100, 10);

  return (
    <div className="shape-preview">
      <svg viewBox="0 0 200 120" role="img" aria-label="Shape preview">
        {polylines.map((points, index) => (
          <polyline
            key={index}
            points={points}
            fill="none"
            stroke="#C4622D"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}
