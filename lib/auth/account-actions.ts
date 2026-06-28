"use server";

import { redirect } from "next/navigation";
import { deleteUserAccount } from "@/lib/account-deletion";
import { buildExportFilename, exportUserData } from "@/lib/data-export";
import { createClient } from "@/lib/supabase/server";

export type AccountActionState = {
  error?: string;
  message?: string;
  exportJson?: string;
  exportFilename?: string;
  requiresPassword?: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function sessionRequiresReauth(lastSignInAt: string | undefined): boolean {
  if (!lastSignInAt) return true;
  const lastSignIn = new Date(lastSignInAt).getTime();
  if (Number.isNaN(lastSignIn)) return true;
  return Date.now() - lastSignIn > DAY_MS;
}

export async function exportUserDataAction(): Promise<AccountActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to export your data." };
  }

  const payload = await exportUserData(user.id);
  if (!payload) {
    return { error: "Unable to export your data right now. Please try again." };
  }

  return {
    exportJson: JSON.stringify(payload, null, 2),
    exportFilename: buildExportFilename(),
  };
}

export async function deleteUserAccountAction(
  _prev: AccountActionState,
  formData: FormData
): Promise<AccountActionState> {
  const confirmation = String(formData.get("confirmation") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const reason = String(formData.get("reason") ?? "").trim() || null;

  if (confirmation !== "DELETE") {
    return { error: 'Type DELETE to confirm account deletion.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "You must be signed in to delete your account." };
  }

  const needsPassword = sessionRequiresReauth(user.last_sign_in_at);
  if (needsPassword) {
    if (!password) {
      return {
        error: "Enter your password to confirm deletion.",
        requiresPassword: true,
      };
    }

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });

    if (reauthError) {
      return { error: "Password incorrect. Account deletion cancelled.", requiresPassword: true };
    }
  }

  const result = await deleteUserAccount({
    userId: user.id,
    email: user.email,
    reason,
  });

  if (!result.ok) {
    return { error: result.error };
  }

  await supabase.auth.signOut();
  redirect("/?account_deleted=1");
}
