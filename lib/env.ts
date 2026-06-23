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

/** Local QA only — skip login on /outdoor, /dashboard, etc. Never enable in production. */
export function isDevAuthBypass(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.KARTA_DEV_BYPASS_AUTH === "true"
  );
}

export function isGoogleMapsConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return Boolean(key && key.trim().length > 0);
}

export function isGoogleRoadsConfigured(): boolean {
  const key =
    process.env.GOOGLE_ROADS_API_KEY ??
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return Boolean(key && key.trim().length > 0);
}

export function isGoogleRoutesConfigured(): boolean {
  const key =
    process.env.GOOGLE_ROUTES_API_KEY ??
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return Boolean(key && key.trim().length > 0);
}

export function isStravaConfigured(): boolean {
  const id = process.env.STRAVA_CLIENT_ID?.trim();
  const secret = process.env.STRAVA_CLIENT_SECRET?.trim();
  return Boolean(id && secret);
}

export function getAppUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  if (configured && !configured.includes("localhost")) {
    if (configured === "https://karta.club") {
      return "https://www.karta.club";
    }
    return configured;
  }

  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/\/$/, "");
  if (productionUrl) {
    return productionUrl.startsWith("http")
      ? productionUrl
      : `https://${productionUrl}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return configured ?? "http://localhost:3000";
}

export type ServiceStatus = {
  supabase: boolean;
  resend: boolean;
  localData: boolean;
  googleMaps: boolean;
  googleRoads: boolean;
  googleRoutes: boolean;
  strava: boolean;
  appUrl: string;
};

export function getServiceStatus(): ServiceStatus {
  return {
    supabase: isSupabaseConfigured(),
    resend: isResendConfigured(),
    localData: isLocalDataMode(),
    googleMaps: isGoogleMapsConfigured(),
    googleRoads: isGoogleRoadsConfigured(),
    googleRoutes: isGoogleRoutesConfigured(),
    strava: isStravaConfigured(),
    appUrl: getAppUrl(),
  };
}
