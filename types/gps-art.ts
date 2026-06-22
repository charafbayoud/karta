import type { RouteGeneratorDistance } from "@/types/route-generator";

export type OutdoorSport = "cycling" | "running" | "walking";
export type GpsArtShapeType = "alphabet";
export type GpsArtDistance = RouteGeneratorDistance;

export interface GpsArtRequest {
  sport: OutdoorSport;
  shapeType: GpsArtShapeType;
  text: string;
  distanceKm: GpsArtDistance;
  start: {
    lat: number;
    lng: number;
  };
}

export interface GpsArtPoint {
  lat: number;
  lng: number;
}

export interface GpsArtResult {
  routeName: string;
  shapeLabel: string;
  sport: OutdoorSport;
  distanceKm: number;
  durationMin: number;
  elevationM: number;
  /** Exact shape strokes — share preview & art image */
  shapeStrokes: GpsArtPoint[][];
  shapePoints: GpsArtPoint[];
  /** Rideable strokes snapped to roads — GPX & map preview */
  routeStrokes: GpsArtPoint[][];
  routePoints: GpsArtPoint[];
  gpx: string;
  routeGpx: string;
  /** @deprecated Use routePoints */
  points: GpsArtPoint[];
  warning?: string;
  snappedToRoads?: boolean;
}

export const GPS_ART_MAX_LETTERS = 10;
