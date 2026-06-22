import type { Route } from "@/types/route";

const LAST_SEED_KEY = "karta-last-circuit-seed";
const LAST_PATH_KEY = "karta-last-circuit-path";

export type CircuitVariant =
  | "loop"
  | "oval"
  | "figure-eight"
  | "lollipop"
  | "out-and-back"
  | "triangle";

export interface RouteCircuitSchema {
  seed: number;
  variant: CircuitVariant;
  isLoop: boolean;
  circuitPoints: string;
  elevationPath: string;
  elevationFill: string;
  start: { x: number; y: number };
  finish: { x: number; y: number };
}

interface NormalizedRoute {
  distanceKm: number;
  elevationM: number;
  difficulty: Route["difficulty"];
  tags: string[];
  name: string;
  id: string;
}

const VARIANTS: CircuitVariant[] = [
  "loop",
  "oval",
  "figure-eight",
  "lollipop",
  "out-and-back",
  "triangle",
];

function createRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function normalizeRoute(route: Route): NormalizedRoute {
  return {
    id: route.id ?? route.route_name,
    name: route.route_name,
    distanceKm: Number(route.distance_km) || 0,
    elevationM: Number(route.elevation_m) || 0,
    difficulty: route.difficulty,
    tags: Array.isArray(route.training_tags) ? route.training_tags : [],
  };
}

function rotatePoint(
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number
): { x: number; y: number } {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = x - cx;
  const dy = y - cy;
  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  };
}

function pathFromCoords(coords: { x: number; y: number }[], close = false): string {
  if (coords.length === 0) return "";
  let path = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  for (let i = 1; i < coords.length; i += 1) {
    path += ` L ${coords[i].x.toFixed(1)} ${coords[i].y.toFixed(1)}`;
  }
  if (close) path += " Z";
  return path;
}

function pickVariant(seed: number, route: NormalizedRoute): CircuitVariant {
  const lower = route.name.toLowerCase();
  if (/(kom|climb|ascent|up\b|epic)/i.test(lower) && route.distanceKm > 20) {
    return seed % 2 === 0 ? "out-and-back" : "triangle";
  }
  return VARIANTS[seed % VARIANTS.length];
}

function buildLoopPath(
  radius: number,
  points: number,
  rng: () => number,
  rotation: number
): { path: string; start: { x: number; y: number } } {
  const cx = 100;
  const cy = 100;
  const raw: { x: number; y: number }[] = [];

  for (let i = 0; i < points; i += 1) {
    const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
    const wobble = 0.72 + rng() * 0.45;
    raw.push(
      rotatePoint(
        cx + Math.cos(angle) * radius * wobble,
        cy + Math.sin(angle) * radius * (0.78 + rng() * 0.35),
        cx,
        cy,
        rotation
      )
    );
  }

  const start = raw[0];
  let path = `M ${start.x.toFixed(1)} ${start.y.toFixed(1)}`;
  for (let i = 0; i < raw.length; i += 1) {
    const current = raw[i];
    const next = raw[(i + 1) % raw.length];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    path += ` Q ${current.x.toFixed(1)} ${current.y.toFixed(1)} ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }
  path += " Z";
  return { path, start };
}

function buildOvalPath(
  radiusX: number,
  radiusY: number,
  rotation: number
): { path: string; start: { x: number; y: number } } {
  const cx = 100;
  const cy = 100;
  const points = 24;
  const raw: { x: number; y: number }[] = [];

  for (let i = 0; i < points; i += 1) {
    const angle = (i / points) * Math.PI * 2;
    raw.push(
      rotatePoint(
        cx + Math.cos(angle) * radiusX,
        cy + Math.sin(angle) * radiusY,
        cx,
        cy,
        rotation
      )
    );
  }

  return { path: pathFromCoords(raw, true), start: raw[0] };
}

function buildFigureEightPath(
  radius: number,
  rotation: number,
  rng: () => number
): { path: string; start: { x: number; y: number } } {
  const cx = 100;
  const cy = 100;
  const offset = radius * (0.55 + rng() * 0.2);
  const points = 28;
  const raw: { x: number; y: number }[] = [];

  for (let i = 0; i < points; i += 1) {
    const t = (i / points) * Math.PI * 2;
    const x = cx + Math.sin(t) * radius + Math.sin(t * 2) * offset * 0.35;
    const y = cy + Math.sin(t * 2) * radius * 0.55;
    raw.push(rotatePoint(x, y, cx, cy, rotation));
  }

  return { path: pathFromCoords(raw, true), start: raw[0] };
}

function buildLollipopPath(
  radius: number,
  rotation: number,
  rng: () => number
): { path: string; start: { x: number; y: number }; finish: { x: number; y: number } } {
  const cx = 100;
  const cy = 88;
  const loop = buildLoopPath(radius * 0.72, 7 + Math.floor(rng() * 3), rng, rotation);
  const stemAngle = rotation + Math.PI / 2 + (rng() * 0.6 - 0.3);
  const stemLength = 34 + rng() * 18;
  const head = loop.start;
  const tail = rotatePoint(head.x, head.y + stemLength, head.x, head.y, stemAngle - rotation - Math.PI / 2);
  const stem = `M ${head.x.toFixed(1)} ${head.y.toFixed(1)} L ${tail.x.toFixed(1)} ${tail.y.toFixed(1)}`;

  return {
    path: `${loop.path} ${stem}`,
    start: tail,
    finish: head,
  };
}

function buildTrianglePath(
  radius: number,
  rotation: number,
  rng: () => number
): { path: string; start: { x: number; y: number } } {
  const cx = 100;
  const cy = 100;
  const corners = 3 + Math.floor(rng() * 2);
  const raw: { x: number; y: number }[] = [];

  for (let i = 0; i < corners; i += 1) {
    const angle = (i / corners) * Math.PI * 2 - Math.PI / 2;
    const wobble = 0.85 + rng() * 0.3;
    raw.push(
      rotatePoint(
        cx + Math.cos(angle) * radius * wobble,
        cy + Math.sin(angle) * radius * wobble,
        cx,
        cy,
        rotation
      )
    );
  }

  return { path: pathFromCoords(raw, true), start: raw[0] };
}

function buildOutAndBackPath(
  route: NormalizedRoute,
  rng: () => number,
  rotation: number
): { path: string; start: { x: number; y: number }; finish: { x: number; y: number } } {
  const cx = 100;
  const cy = 100;
  const segments = 5 + Math.floor(rng() * 4);
  const length = 58 + rng() * 18;
  const raw: { x: number; y: number }[] = [{ x: cx - length, y: cy + 18 - rng() * 10 }];

  for (let i = 0; i < segments; i += 1) {
    const prev = raw[raw.length - 1];
    const progress = i / segments;
    const climbingHalf = progress > 0.4 && route.elevationM > 200;
    raw.push({
      x: prev.x + length / segments,
      y: prev.y + (climbingHalf ? -(5 + rng() * 14) : rng() * 12 - 6),
    });
  }

  const turnaround = { ...raw[raw.length - 1] };
  for (let i = raw.length - 2; i >= 0; i -= 1) {
    raw.push({
      x: raw[i].x + (rng() * 10 - 5),
      y: raw[i].y + (rng() * 8 - 4),
    });
  }

  const rotated = raw.map((point) => rotatePoint(point.x, point.y, cx, cy, rotation));
  return {
    path: pathFromCoords(rotated),
    start: rotated[0],
    finish: rotatePoint(turnaround.x, turnaround.y, cx, cy, rotation),
  };
}

function buildCircuitPath(
  route: NormalizedRoute,
  rng: () => number,
  variant: CircuitVariant,
  seed: number
): {
  circuitPoints: string;
  start: { x: number; y: number };
  finish: { x: number; y: number };
  isLoop: boolean;
} {
  const rotation = ((seed % 360) * Math.PI) / 180 + rng() * Math.PI * 2;
  const radius =
    24 +
    Math.min(28, route.distanceKm * 1.05) +
    rng() * 12 -
    (route.elevationM > 800 ? 5 : 0);

  switch (variant) {
    case "out-and-back": {
      const line = buildOutAndBackPath(route, rng, rotation);
      return { ...line, circuitPoints: line.path, isLoop: false };
    }
    case "lollipop": {
      const lollipop = buildLollipopPath(radius, rotation, rng);
      return { ...lollipop, circuitPoints: lollipop.path, isLoop: false };
    }
    case "figure-eight": {
      const eight = buildFigureEightPath(radius * 0.82, rotation, rng);
      return { ...eight, circuitPoints: eight.path, finish: eight.start, isLoop: true };
    }
    case "oval": {
      const oval = buildOvalPath(
        radius * (1.1 + rng() * 0.25),
        radius * (0.65 + rng() * 0.2),
        rotation
      );
      return { ...oval, circuitPoints: oval.path, finish: oval.start, isLoop: true };
    }
    case "triangle": {
      const triangle = buildTrianglePath(radius * 0.95, rotation, rng);
      return { ...triangle, circuitPoints: triangle.path, finish: triangle.start, isLoop: true };
    }
    case "loop":
    default: {
      const loop = buildLoopPath(radius, 6 + Math.floor(rng() * 4), rng, rotation);
      return { ...loop, circuitPoints: loop.path, finish: loop.start, isLoop: true };
    }
  }
}

function buildElevationPath(
  route: NormalizedRoute,
  rng: () => number,
  isLoop: boolean,
  seed: number
): { line: string; fill: string } {
  const width = 120;
  const height = 48;
  const baseline = height - 4;
  const ratio = route.elevationM / Math.max(route.distanceKm, 1);
  const intensity = Math.min(
    1,
    (ratio / 70) *
      (route.difficulty === "epic"
        ? 1.3
        : route.difficulty === "hard"
          ? 1.1
          : route.difficulty === "moderate"
            ? 0.9
            : 0.7)
  );

  const peakCount = Math.max(1, Math.min(6, Math.round(route.elevationM / 220)));
  const phase = (seed % 100) / 100;
  const peaks = Array.from({ length: peakCount }, (_, index) => ({
    center: ((index + 1) / (peakCount + 1) + phase * 0.35 + rng() * 0.15) % 1,
    spread: 0.06 + rng() * 0.06,
    height: (14 + rng() * 24) * intensity,
  }));

  if (route.tags.includes("recovery")) {
    peaks.forEach((peak) => {
      peak.height *= 0.35;
    });
  }
  if (route.tags.includes("climbing")) {
    peaks.forEach((peak) => {
      peak.height *= 1.25;
    });
  }

  const samples = 32;
  const coords: { x: number; y: number }[] = [];

  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    const x = t * width;
    let elevation = 0;

    for (const peak of peaks) {
      const dist = Math.abs(t - peak.center);
      elevation += Math.max(0, peak.height * (1 - dist / peak.spread));
    }

    if (!isLoop && t > 0.5) {
      elevation *= Math.max(0.12, 1.15 - (t - 0.5) * 1.7);
    }

    const rolling = Math.sin((t + phase) * Math.PI * (2 + rng() * 3)) * 2.5 * intensity;
    const y = baseline - Math.min(baseline - 6, elevation + rolling);
    coords.push({ x, y });
  }

  const line = coords
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`
    )
    .join(" ");
  const fill = `${line} L ${width} ${baseline} L 0 ${baseline} Z`;

  return { line, fill };
}

export function rememberCircuitSeed(seed: number) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LAST_SEED_KEY, String(seed));
}

export function rememberCircuitPath(path: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LAST_PATH_KEY, path);
}

export function getLastCircuitPath(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(LAST_PATH_KEY);
}

export function getLastCircuitSeed(): number | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(LAST_SEED_KEY);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

/** High-entropy seed — different schematic on every generation. */
export function pickNextCircuitSeed(): number {
  const entropy =
    Date.now() ^
    Math.floor(Math.random() * 0xffffffff) ^
    (getLastCircuitSeed() ?? 0);
  const next = entropy >>> 0;
  rememberCircuitSeed(next);
  return next;
}

export function buildRouteCircuitSchema(route: Route, seed?: number): RouteCircuitSchema {
  const normalized = normalizeRoute(route);
  const resolvedSeed = seed ?? hashString(`${normalized.id}-${Date.now()}`);
  const variant = pickVariant(resolvedSeed, normalized);
  const rng = createRng(resolvedSeed ^ hashString(normalized.name) ^ hashString(variant));
  const circuit = buildCircuitPath(normalized, rng, variant, resolvedSeed);
  const elevation = buildElevationPath(normalized, rng, circuit.isLoop, resolvedSeed);

  return {
    seed: resolvedSeed,
    variant,
    isLoop: circuit.isLoop,
    circuitPoints: circuit.circuitPoints,
    elevationPath: elevation.line,
    elevationFill: elevation.fill,
    start: circuit.start,
    finish: circuit.finish,
  };
}

/** Build a schematic guaranteed to differ from the previous one when possible. */
export function buildUniqueRouteCircuitSchema(route: Route): RouteCircuitSchema {
  const lastPath = getLastCircuitPath();
  let seed = pickNextCircuitSeed();

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const schema = buildRouteCircuitSchema(route, seed);
    if (!lastPath || schema.circuitPoints !== lastPath) {
      rememberCircuitPath(schema.circuitPoints);
      rememberCircuitSeed(seed);
      return schema;
    }
    seed = (seed + 7919 + attempt * 1337) >>> 0;
  }

  const fallback = buildRouteCircuitSchema(route, seed);
  rememberCircuitPath(fallback.circuitPoints);
  rememberCircuitSeed(seed);
  return fallback;
}
