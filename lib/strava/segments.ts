import { STRAVA_API_BASE } from "@/lib/strava/config";
import { getStravaExploreAccessToken } from "@/lib/strava/tokens";

export type StravaExploreSegment = {
  id: number;
  name: string;
  distance: number;
  elev_difference?: number;
  avg_grade?: number;
  start_latlng?: [number, number];
  end_latlng?: [number, number];
  star_count?: number;
};

type ExploreResponse = {
  segments?: StravaExploreSegment[];
};

function activityTypeForSport(sport: "cycling" | "running" | "walking"): string {
  if (sport === "cycling") return "riding";
  return "running";
}

function boundsAround(lat: number, lng: number, radiusKm: number): string {
  const delta = radiusKm / 111;
  const south = lat - delta;
  const north = lat + delta;
  const west = lng - delta;
  const east = lng + delta;
  return `${south},${west},${north},${east}`;
}

export async function exploreStravaSegments(
  userId: string,
  lat: number,
  lng: number,
  sport: "cycling" | "running" | "walking",
  radiusKm = 8
): Promise<StravaExploreSegment[]> {
  const accessToken = await getStravaExploreAccessToken(userId);
  if (!accessToken) {
    return [];
  }

  const url = new URL(`${STRAVA_API_BASE}/segments/explore`);
  url.searchParams.set("bounds", boundsAround(lat, lng, radiusKm));
  url.searchParams.set("activity_type", activityTypeForSport(sport));

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Strava segments: ${response.status} ${detail}`);
  }

  const data = (await response.json()) as ExploreResponse;
  const segments = data.segments ?? [];

  return segments.sort((a, b) => (b.star_count ?? 0) - (a.star_count ?? 0));
}
