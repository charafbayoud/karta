import { NextResponse } from "next/server";
import { disconnectStrava } from "@/lib/strava/tokens";
import { requireAuthenticatedUser } from "@/lib/strava/session";

export async function POST() {
  const auth = await requireAuthenticatedUser();

  if (auth.error === "unauthenticated" || !auth.user) {
    return NextResponse.json({ error: "Sign in to disconnect Strava." }, { status: 401 });
  }

  await disconnectStrava(auth.user.id);
  return NextResponse.json({ ok: true });
}
