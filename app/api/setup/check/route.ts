import { NextResponse } from "next/server";
import {
  readSupabaseAdminKey,
  readSupabaseAnonKey,
  readSupabaseServiceRoleKey,
  readSupabaseUrl,
  validateSupabaseEnvForServer,
} from "@/lib/supabase/env";
import { isStravaConfigured } from "@/lib/env";
import { getStravaRedirectUri } from "@/lib/strava/config";

/** Public diagnostic — no auth required. Helps debug Vercel env without reading secrets. */
export async function GET() {
  const url = readSupabaseUrl();
  const anonKey = readSupabaseAnonKey();
  const serviceRoleKey = readSupabaseServiceRoleKey();
  const envIssue = validateSupabaseEnvForServer();

  let profilesTable: "ok" | "missing" | "error" | "skipped" = "skipped";
  let profilesError: string | undefined;

  if (!envIssue) {
    try {
      const { getSupabaseAdmin } = await import("@/lib/supabase");
      const admin = getSupabaseAdmin();
      const { error } = await admin.from("profiles").select("id").limit(1);

      if (error?.code === "PGRST205" || error?.code === "42P01") {
        profilesTable = "missing";
        profilesError = "Run supabase/RUN-ME-STRAVA.sql in Supabase SQL Editor.";
      } else if (error) {
        profilesTable = "error";
        profilesError = error.message;
      } else {
        profilesTable = "ok";
      }
    } catch (error) {
      profilesTable = "error";
      profilesError = error instanceof Error ? error.message : String(error);
    }
  }

  return NextResponse.json({
    ok: !envIssue && profilesTable === "ok",
    supabase: {
      urlSet: Boolean(url),
      urlLooksValid: url.includes(".supabase.co"),
      anonKeySet: Boolean(anonKey),
      anonKeyLooksValid: anonKey.startsWith("eyJ"),
      serviceRoleKeySet: Boolean(serviceRoleKey),
      serviceRoleKeyLooksValid: serviceRoleKey.startsWith("eyJ"),
      envIssue: envIssue?.message ?? null,
      profilesTable,
      profilesError,
    },
    strava: {
      configured: isStravaConfigured(),
      redirectUri: getStravaRedirectUri(),
    },
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? null,
  });
}
