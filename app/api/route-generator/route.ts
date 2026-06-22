import { NextResponse } from "next/server";
import { generateGpx } from "@/lib/gpx-generator";
import { generateLoopVariants, type GeneratedLoop } from "@/lib/route-generator/loop";
import { exploreStravaSegments } from "@/lib/strava/segments";
import { requireAuthenticatedUser } from "@/lib/strava/session";
import { getValidStravaAccessToken } from "@/lib/strava/tokens";
import type {
  RouteGeneratorRequest,
  RouteGeneratorResponse,
  RouteGeneratorResult,
} from "@/types/route-generator";
import { isValidRouteGeneratorDistance } from "@/types/route-generator";

function toRouteResult(
  loop: GeneratedLoop,
  body: RouteGeneratorRequest,
  routeName: string
): RouteGeneratorResult {
  const elevationM = loop.segmentsUsed.reduce(
    (sum, segment) => sum + Math.round(segment.elev_difference ?? 0),
    0
  );

  return {
    routeName,
    sport: body.sport,
    distanceKm: loop.distanceKm,
    durationMin: loop.durationMin,
    elevationM: elevationM || Math.round(loop.distanceKm * 8),
    points: loop.points,
    gpx: generateGpx(routeName, loop.points, body.sport),
    segmentsUsed: loop.segmentsUsed.map((segment) => ({
      id: segment.id,
      name: segment.name,
      distanceKm: Math.round((segment.distance / 1000) * 10) / 10,
      elevationM: Math.round(segment.elev_difference ?? 0),
    })),
    warning: loop.warning,
    variantKey: loop.variantKey,
  };
}

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser();
  if (auth.error === "unauthenticated" || !auth.user) {
    return NextResponse.json({ error: "Connecte-toi à KARTA." }, { status: 401 });
  }

  const token = await getValidStravaAccessToken(auth.user.id);
  if (!token) {
    return NextResponse.json(
      { error: "Connecte Strava pour chercher des segments près de toi." },
      { status: 403 }
    );
  }

  let body: RouteGeneratorRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!body.start?.lat || !body.start?.lng) {
    return NextResponse.json({ error: "Choisis un point de départ." }, { status: 400 });
  }

  if (!isValidRouteGeneratorDistance(body.sport, body.distanceKm)) {
    return NextResponse.json({ error: "Distance invalide pour ce sport." }, { status: 400 });
  }

  try {
    const segments = await exploreStravaSegments(
      auth.user.id,
      body.start.lat,
      body.start.lng,
      body.sport,
      segmentSearchRadiusKm(body.distanceKm)
    );

    const { primary, alternatives } = await generateLoopVariants({
      start: body.start,
      sport: body.sport,
      targetDistanceKm: body.distanceKm,
      segments,
      seed: body.seed ?? Date.now(),
      excludeKeys: Array.isArray(body.excludeKeys) ? body.excludeKeys.slice(0, 20) : [],
    });

    const response: RouteGeneratorResponse = {
      route: toRouteResult(
        primary,
        body,
        `Boucle recommandée — ~${primary.distanceKm} km`
      ),
      alternatives: alternatives.map((loop, index) =>
        toRouteResult(
          loop,
          body,
          `Circuit ${index + 2} — ${loop.label} (~${loop.distanceKm} km)`
        )
      ),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[route-generator]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Impossible de générer la boucle.",
      },
      { status: 502 }
    );
  }
}

function segmentSearchRadiusKm(targetDistanceKm: number): number {
  return Math.min(16, Math.max(5, targetDistanceKm / 4));
}
