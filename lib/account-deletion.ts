import { createHash } from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { disconnectStrava } from "@/lib/strava/tokens";
import { getValidStravaAccessToken } from "@/lib/strava/tokens";
import { sendAccountDeletedEmail } from "@/lib/resend";
import type { Profile } from "@/types/user";

export type AccountDeletionResult =
  | { ok: true }
  | { ok: false; error: string; step?: string };

function hashUserId(userId: string): string {
  return createHash("sha256").update(userId).digest("hex");
}

async function revokeStravaAccess(userId: string): Promise<void> {
  try {
    const accessToken = await getValidStravaAccessToken(userId);
    if (accessToken) {
      await fetch(`https://www.strava.com/oauth/deauthorize?access_token=${accessToken}`, {
        method: "POST",
      });
    }
  } catch (error) {
    console.warn("[account-deletion] Strava deauthorize failed:", error);
  }

  await disconnectStrava(userId);
}

async function cancelStripeIfConfigured(_userId: string, _profile: Profile): Promise<void> {
  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!stripeKey || stripeKey.startsWith("sk_test_your") || stripeKey.startsWith("sk_live_your")) {
    return;
  }

  // Stripe is not wired to profiles yet — no-op until billing ships.
}

export async function deleteUserAccount(input: {
  userId: string;
  email: string;
  reason?: string | null;
}): Promise<AccountDeletionResult> {
  const admin = getSupabaseAdmin();
  const steps: string[] = [];

  try {
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("*")
      .eq("id", input.userId)
      .maybeSingle();

    if (profileError) {
      throw new Error(`profile_lookup:${profileError.message}`);
    }

    const { error: routesError } = await admin
      .from("saved_routes")
      .delete()
      .eq("user_id", input.userId);

    if (routesError) {
      throw new Error(`saved_routes:${routesError.message}`);
    }
    steps.push("saved_routes");

    if (profile?.strava_connected) {
      await revokeStravaAccess(input.userId);
    }
    steps.push("strava");

    await cancelStripeIfConfigured(input.userId, profile as Profile);
    steps.push("stripe");

    try {
      await sendAccountDeletedEmail(input.email);
    } catch (emailError) {
      console.error("[account-deletion] confirmation email failed:", emailError);
    }
    steps.push("email");

    const { error: profileDeleteError } = await admin
      .from("profiles")
      .delete()
      .eq("id", input.userId);

    if (profileDeleteError) {
      throw new Error(`profiles:${profileDeleteError.message}`);
    }
    steps.push("profiles");

    const { error: authDeleteError } = await admin.auth.admin.deleteUser(input.userId);
    if (authDeleteError) {
      throw new Error(`auth_user:${authDeleteError.message}`);
    }
    steps.push("auth_user");

    const { error: logError } = await admin.from("deleted_accounts_log").insert({
      user_id_hash: hashUserId(input.userId),
      reason: input.reason ?? null,
    });

    if (logError) {
      console.error("[account-deletion] audit log failed:", logError);
      steps.push("deleted_accounts_log:failed");
    } else {
      steps.push("deleted_accounts_log");
    }

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown deletion error";
    const step = message.includes(":") ? message.split(":")[0] : "unknown";
    console.error("[account-deletion] failed", { steps, error: message });
    return { ok: false, error: "Unable to delete your account completely. Contact hello@karta.club.", step };
  }
}
