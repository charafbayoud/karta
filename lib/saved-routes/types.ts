import type { PrimarySport, SavedRouteType } from "@/types/user";

export type SaveRouteInput = {
  routeName: string;
  type: SavedRouteType;
  sport?: PrimarySport;
  distanceKm?: number;
  elevationM?: number;
  durationMin?: number;
  gpxData?: string;
  mapPreviewUrl?: string;
  shapeType?: string;
  zwiftWorld?: string;
};
