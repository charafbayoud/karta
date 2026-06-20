import { getSupabaseAdmin } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import type { PrimaryExperience, PrimarySport, Profile } from "@/types/user";

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return data as Profile | null;
}

export async function upsertProfile(input: {
  id: string;
  email: string;
  name?: string;
  primary_sport?: PrimarySport;
  primary_experience?: PrimaryExperience;
}): Promise<Profile> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("profiles")
    .upsert(
      {
        id: input.id,
        email: input.email,
        name: input.name ?? null,
        primary_sport: input.primary_sport ?? null,
        primary_experience: input.primary_experience ?? null,
      },
      { onConflict: "id" }
    )
    .select("*")
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function getRiderCount(): Promise<number | null> {
  try {
    const admin = getSupabaseAdmin();
    const { count, error } = await admin
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (error) return null;
    return count ?? 0;
  } catch {
    return null;
  }
}

export function getFirstName(profile: Profile | null, email?: string | null): string {
  if (profile?.name?.trim()) {
    return profile.name.trim().split(/\s+/)[0] ?? "Rider";
  }
  if (email?.includes("@")) {
    return email.split("@")[0] ?? "Rider";
  }
  return "Rider";
}
