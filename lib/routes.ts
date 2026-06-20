import { getSupabaseAdmin } from "@/lib/supabase";
import { isLocalDataMode } from "@/lib/env";
import { getSeedRoutes } from "@/lib/seed-routes";
import type { Route } from "@/types/route";

export async function fetchRoutes(): Promise<{ routes: Route[]; source: "supabase" | "local" }> {
  if (isLocalDataMode()) {
    return { routes: getSeedRoutes(), source: "local" };
  }

  const supabase = getSupabaseAdmin();
  let { data, error } = await supabase.from("zwift_routes").select("*");

  if (error?.code === "42P01") {
    ({ data, error } = await supabase.from("routes").select("*"));
  }

  if (error) throw error;

  const routes = (data ?? []) as Route[];

  if (routes.length === 0) {
    console.warn("Supabase routes table is empty — falling back to local seed data.");
    return { routes: getSeedRoutes(), source: "local" };
  }

  return { routes, source: "supabase" };
}
