"use server";

import { redirect } from "next/navigation";
import { upsertProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { sendSignupWelcomeEmail } from "@/lib/resend";
import type { PrimaryExperience, PrimarySport } from "@/types/user";

export type AuthActionState = {
  error?: string;
};

export async function signUpWithEmail(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const primarySport = formData.get("primary_sport") as PrimarySport | null;
  const primaryExperience = formData.get("primary_experience") as PrimaryExperience | null;

  if (!email || !password || password.length < 8) {
    return { error: "Use a valid email and a password of at least 8 characters." };
  }

  if (!primarySport || !primaryExperience) {
    return { error: "Choose your sport and primary experience." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, primary_sport: primarySport, primary_experience: primaryExperience },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Unable to create your account. Please try again." };
  }

  try {
    await upsertProfile({
      id: data.user.id,
      email,
      name,
      primary_sport: primarySport,
      primary_experience: primaryExperience,
    });
  } catch (profileError) {
    console.error("Profile creation failed:", profileError);
    return { error: "Account created but profile setup failed. Contact support." };
  }

  try {
    await sendSignupWelcomeEmail(email);
  } catch (emailError) {
    console.error("Welcome email failed:", emailError);
  }

  redirect("/dashboard");
}

export async function signInWithEmail(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function completeOnboarding(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const primarySport = formData.get("primary_sport") as PrimarySport | null;
  const primaryExperience = formData.get("primary_experience") as PrimaryExperience | null;

  if (!primarySport || !primaryExperience) {
    return { error: "Choose your sport and primary experience." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "You must be signed in to continue." };
  }

  const name =
    (user.user_metadata?.name as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined) ??
    undefined;

  try {
    await upsertProfile({
      id: user.id,
      email: user.email,
      name,
      primary_sport: primarySport,
      primary_experience: primaryExperience,
    });
  } catch (profileError) {
    console.error("Onboarding profile update failed:", profileError);
    return { error: "Unable to save your preferences." };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
