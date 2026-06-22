import { NextRequest, NextResponse } from "next/server";
import {
  deleteSavedRouteForUser,
  getSavedRoutes,
  saveRouteForUser,
} from "@/lib/saved-routes/server";
import type { SaveRouteInput } from "@/lib/saved-routes/types";
import { requireAuthenticatedUser } from "@/lib/strava/session";
import type { PrimarySport, SavedRouteType } from "@/types/user";

const ROUTE_TYPES: SavedRouteType[] = ["indoor", "outdoor", "gps-art"];
const SPORTS: PrimarySport[] = ["cycling", "running", "walking"];

function toOptionalNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function normalizeSaveRouteInput(body: unknown): SaveRouteInput | null {
  if (!body || typeof body !== "object") return null;

  const input = body as Record<string, unknown>;
  const routeName = typeof input.routeName === "string" ? input.routeName.trim() : "";
  const type = input.type;

  if (!routeName || !ROUTE_TYPES.includes(type as SavedRouteType)) {
    return null;
  }

  const sport = input.sport;
  if (sport !== undefined && !SPORTS.includes(sport as PrimarySport)) {
    return null;
  }

  return {
    routeName,
    type: type as SavedRouteType,
    sport: sport as PrimarySport | undefined,
    distanceKm: toOptionalNumber(input.distanceKm),
    elevationM: toOptionalNumber(input.elevationM),
    durationMin: toOptionalNumber(input.durationMin),
    gpxData: typeof input.gpxData === "string" ? input.gpxData : undefined,
    mapPreviewUrl: typeof input.mapPreviewUrl === "string" ? input.mapPreviewUrl : undefined,
    shapeType: typeof input.shapeType === "string" ? input.shapeType : undefined,
    zwiftWorld: typeof input.zwiftWorld === "string" ? input.zwiftWorld : undefined,
  };
}

export async function GET(request: NextRequest) {
  const auth = await requireAuthenticatedUser();

  if (auth.error === "unauthenticated" || !auth.user) {
    return NextResponse.json({ error: "Sign in to view saved routes." }, { status: 401 });
  }

  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;
  const routes = await getSavedRoutes(
    limit && Number.isFinite(limit) && limit > 0 ? limit : undefined
  );

  return NextResponse.json({ routes });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedUser();

  if (auth.error === "unauthenticated" || !auth.user) {
    return NextResponse.json({ error: "Sign in to save routes." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = normalizeSaveRouteInput(body);

    if (!input) {
      return NextResponse.json({ error: "Invalid saved route payload." }, { status: 400 });
    }

    const { route, error } = await saveRouteForUser(auth.user.id, input);

    if (error || !route) {
      return NextResponse.json({ error: error ?? "Unable to save route." }, { status: 500 });
    }

    return NextResponse.json({ route });
  } catch (error) {
    console.error("Save route error:", error);
    return NextResponse.json({ error: "Unable to save route." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuthenticatedUser();

  if (auth.error === "unauthenticated" || !auth.user) {
    return NextResponse.json({ error: "Sign in to delete routes." }, { status: 401 });
  }

  const routeId = request.nextUrl.searchParams.get("id");

  if (!routeId) {
    return NextResponse.json({ error: "Missing route id." }, { status: 400 });
  }

  const { ok, error } = await deleteSavedRouteForUser(auth.user.id, routeId);

  if (!ok) {
    return NextResponse.json({ error: error ?? "Unable to delete route." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
