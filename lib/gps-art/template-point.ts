export type TemplatePoint = { x: number; y: number };

export function normalizeLetter(points: TemplatePoint[]): TemplatePoint[] {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const span = Math.max(maxX - minX, maxY - minY, 0.001);

  return points.map((point) => ({
    x: ((point.x - minX) / span - 0.5) * 0.9,
    y: ((point.y - minY) / span - 0.5) * 0.9,
  }));
}

/** Normalize all strokes of a letter together so proportions stay correct. */
export function normalizeLetterStrokes(strokes: TemplatePoint[][]): TemplatePoint[][] {
  const points = strokes.flat();
  if (points.length === 0) return strokes;

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const span = Math.max(maxX - minX, maxY - minY, 0.001);

  return strokes.map((stroke) =>
    stroke.map((point) => ({
      x: ((point.x - minX) / span - 0.5) * 0.9,
      y: ((point.y - minY) / span - 0.5) * 0.9,
    }))
  );
}

export function templateToSvgPolyline(
  points: TemplatePoint[],
  width = 100,
  height = 100,
  padding = 8
): string {
  if (points.length === 0) return "";

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = Math.max(maxX - minX, 0.001);
  const spanY = Math.max(maxY - minY, 0.001);

  return points
    .map((point) => {
      const x = ((point.x - minX) / spanX) * (width - padding * 2) + padding;
      const y = ((maxY - point.y) / spanY) * (height - padding * 2) + padding;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function strokesToSvgPolylines(
  strokes: TemplatePoint[][],
  width = 100,
  height = 100,
  padding = 8
): string[] {
  return strokes
    .filter((stroke) => stroke.length >= 2)
    .map((stroke) => templateToSvgPolyline(stroke, width, height, padding));
}
