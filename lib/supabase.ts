import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  readSupabaseAdminKey,
  readSupabaseAnonKey,
  readSupabaseUrl,
  validateSupabaseEnvForServer,
} from "@/lib/supabase/env";

let supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (supabaseAdmin) return supabaseAdmin;

  const envIssue = validateSupabaseEnvForServer();
  if (envIssue) {
    throw new Error(envIssue.message);
  }

  const url = readSupabaseUrl();
  const key = readSupabaseAdminKey();

  supabaseAdmin = createClient(url, key);
  return supabaseAdmin;
}

export function getSupabaseBrowser(): SupabaseClient {
  const url = readSupabaseUrl();
  const key = readSupabaseAnonKey();

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createClient(url, key);
}
