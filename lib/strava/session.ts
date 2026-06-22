import { createClient } from "@/lib/supabase/server";

export async function requireAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null as null, error: "unauthenticated" as const };
  }

  return { user, error: null as null };
}
