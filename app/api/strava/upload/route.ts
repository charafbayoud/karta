import { NextResponse } from "next/server";
import { uploadGpxToStrava } from "@/lib/strava/upload";
import { requireAuthenticatedUser } from "@/lib/strava/session";

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUser();
  if (auth.error === "unauthenticated" || !auth.user) {
    return NextResponse.json({ error: "Connecte-toi à KARTA." }, { status: 401 });
  }

  let body: {
    gpx?: string;
    name?: string;
    description?: string;
    sport?: "cycling" | "running" | "walking";
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!body.gpx || !body.name) {
    return NextResponse.json({ error: "GPX et nom requis." }, { status: 400 });
  }

  const activityType =
    body.sport === "running" ? "run" : body.sport === "walking" ? "walk" : "ride";

  try {
    const result = await uploadGpxToStrava({
      userId: auth.user.id,
      gpx: body.gpx,
      name: body.name,
      description: body.description,
      activityType,
    });

    return NextResponse.json({
      ok: true,
      uploadId: result.uploadId,
      activityId: result.activityId,
      message:
        "GPX envoyé à Strava — l'activité apparaîtra sur ton profil dans quelques minutes.",
    });
  } catch (error) {
    console.error("[strava/upload]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible d'envoyer sur Strava.",
      },
      { status: 502 }
    );
  }
}
