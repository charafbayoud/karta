import { startStravaOAuth } from "@/lib/strava/start-oauth";

export async function GET(request: Request) {
  return startStravaOAuth(request, "login", "/dashboard");
}
