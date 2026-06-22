import { upsertProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { savedRouteErrorMessage } from "@/lib/saved-routes/errors";
import type { SaveRouteInput } from "@/lib/saved-routes/types";
import type { SavedRoute } from "@/types/user";

export type { SaveRouteInput } from "@/lib/saved-routes/types";
export { formatSavedRouteMeta } from "@/lib/saved-routes/format";

export async function getSavedRoutes(limit?: number): Promise<SavedRoute[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  let query = supabase
    .from("saved_routes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getSavedRoutes:", error);
    return [];
  }

  return (data ?? []) as SavedRoute[];
}

export async function getSavedRouteById(id: string): Promise<SavedRoute | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("saved_routes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("getSavedRouteById:", error);
    return null;
  }

  return data as SavedRoute | null;
}

export async function ensureProfileBeforeSave(
  userId: string
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existing) {
    return { ok: true, error: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { ok: false, error: "Connecte-toi pour sauvegarder une route." };
  }

  try {
    const name =
      (user.user_metadata?.name as string | undefined) ??
      (user.user_metadata?.full_name as string | undefined);

    await upsertProfile({
      id: userId,
      email: user.email,
      name,
    });
    return { ok: true, error: null };
  } catch (error) {
    console.error("ensureProfileBeforeSave:", error);
    return { ok: false, error: savedRouteErrorMessage(error) };
  }
}

export async function saveRouteForUser(
  userId: string,
  input: SaveRouteInput
): Promise<{ route: SavedRoute | null; error: string | null }> {
  const profileReady = await ensureProfileBeforeSave(userId);
  if (!profileReady.ok) {
    return { route: null, error: profileReady.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("saved_routes")
    .insert({
      user_id: userId,
      route_name: input.routeName.trim(),
      type: input.type,
      sport: input.sport ?? null,
      distance_km: input.distanceKm ?? null,
      elevation_m: input.elevationM ?? null,
      duration_min: input.durationMin ?? null,
      gpx_data: input.gpxData ?? null,
      map_preview_url: input.mapPreviewUrl ?? null,
      shape_type: input.shapeType ?? null,
      zwift_world: input.zwiftWorld ?? null,
    })
    .select("*")
    .single();

  if (error) {
    console.error("saveRouteForUser:", error);
    return { route: null, error: savedRouteErrorMessage(error) };
  }

  return { route: data as SavedRoute, error: null };
}

export async function deleteSavedRouteForUser(
  userId: string,
  routeId: string
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("saved_routes")
    .delete()
    .eq("id", routeId)
    .eq("user_id", userId);

  if (error) {
    console.error("deleteSavedRouteForUser:", error);
    return { ok: false, error: "Unable to delete this route." };
  }

  return { ok: true, error: null };
}
