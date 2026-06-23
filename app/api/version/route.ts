import { NextResponse } from "next/server";

/** Public build marker — helps verify which deploy is live on karta.club. */
export async function GET() {
  return NextResponse.json({
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? "local",
    ref: process.env.VERCEL_GIT_COMMIT_REF ?? "local",
    env: process.env.VERCEL_ENV ?? "development",
    builtAt: new Date().toISOString(),
  });
}
