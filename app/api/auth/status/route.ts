import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authCookies = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim().split("=")[0])
    .filter((name) => name.startsWith("sb-")) ?? [];

  return NextResponse.json({
    authenticated: Boolean(user),
    email: user?.email ?? null,
    authCookieCount: authCookies.length,
  });
}
