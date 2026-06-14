export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    url &&
      key &&
      !url.includes("your-project") &&
      !key.startsWith("your-")
  );
}

export function isResendConfigured(): boolean {
  const apiKey = process.env.RESEND_API_KEY;
  return Boolean(apiKey && !apiKey.startsWith("re_your"));
}

export function isLocalDataMode(): boolean {
  if (process.env.KARTA_USE_LOCAL_DATA === "true") return true;
  if (process.env.KARTA_USE_LOCAL_DATA === "false") return false;
  return !isSupabaseConfigured();
}

export type ServiceStatus = {
  supabase: boolean;
  resend: boolean;
  localData: boolean;
  appUrl: string;
};

export function getServiceStatus(): ServiceStatus {
  return {
    supabase: isSupabaseConfigured(),
    resend: isResendConfigured(),
    localData: isLocalDataMode(),
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  };
}
