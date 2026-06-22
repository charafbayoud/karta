import type { OutdoorSport } from "@/types/gps-art";

export const ROUTE_GENERATOR_DISTANCES_BY_SPORT = {
  cycling: [30, 50, 70, 100],
  running: [5, 8, 10, 21, 42],
  walking: [2, 4, 8, 10],
} as const satisfies Record<OutdoorSport, readonly number[]>;

export type RouteGeneratorDistance =
  | (typeof ROUTE_GENERATOR_DISTANCES_BY_SPORT.cycling)[number]
  | (typeof ROUTE_GENERATOR_DISTANCES_BY_SPORT.running)[number]
  | (typeof ROUTE_GENERATOR_DISTANCES_BY_SPORT.walking)[number];

export function getRouteGeneratorDistances(
  sport: OutdoorSport
): readonly RouteGeneratorDistance[] {
  return ROUTE_GENERATOR_DISTANCES_BY_SPORT[sport];
}

export function isValidRouteGeneratorDistance(
  sport: OutdoorSport,
  distanceKm: number
): distanceKm is RouteGeneratorDistance {
  return getRouteGeneratorDistances(sport).includes(distanceKm as RouteGeneratorDistance);
}

export function defaultRouteGeneratorDistance(sport: OutdoorSport): RouteGeneratorDistance {
  return getRouteGeneratorDistances(sport)[0];
}

export type RouteGeneratorSegment = {
  id: number;
  name: string;
  distanceKm: number;
  elevationM: number;
};

export type RouteGeneratorRequest = {
  sport: OutdoorSport;
  distanceKm: RouteGeneratorDistance;
  start: { lat: number; lng: number };
  /** Random seed — new value on each generate for a different loop. */
  seed?: number;
  /** Variant keys to skip (recent generations in this session). */
  excludeKeys?: string[];
};

export type RouteGeneratorResult = {
  routeName: string;
  sport: OutdoorSport;
  distanceKm: number;
  durationMin: number;
  elevationM: number;
  points: Array<{ lat: number; lng: number }>;
  gpx: string;
  segmentsUsed: RouteGeneratorSegment[];
  warning?: string;
  variantKey: string;
};

export type RouteGeneratorResponse = {
  route: RouteGeneratorResult;
  alternatives: RouteGeneratorResult[];
};
