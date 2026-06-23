import { createBrowserClient } from "@supabase/ssr";
import { readSupabaseAnonKey, readSupabaseUrl } from "@/lib/supabase/env";

export function createClient() {
  const url = readSupabaseUrl();
  const key = readSupabaseAnonKey();

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createBrowserClient(url, key);
}
