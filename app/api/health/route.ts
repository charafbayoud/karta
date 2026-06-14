import { NextResponse } from "next/server";
import { getServiceStatus } from "@/lib/env";
import { getSeedRoutes } from "@/lib/seed-routes";

export async function GET() {
  const status = getServiceStatus();

  return NextResponse.json({
    ok: true,
    services: status,
    routesAvailable: getSeedRoutes().length,
    message: status.localData
      ? "Running in local mode — route data and waitlist stored on disk."
      : "Connected to Supabase.",
  });
}
