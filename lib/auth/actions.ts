"use server";

import { redirect } from "next/navigation";
import { upsertProfile } from "@/lib/auth/profile";
import { getAppUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { sendSignupWelcomeEmail } from "@/lib/resend";
import type { PrimaryExperience, PrimarySport } from "@/types/user";

export type AuthActionState = {
  error?: string;
  message?: string;
  redirectTo?: string;
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
    return { error: "Indique un email valide et un mot de passe d'au moins 8 caractères." };
  }

  if (!primarySport || !primaryExperience) {
    return { error: "Choisis ton sport et ton expérience principale." };
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
    return { error: "Impossible de créer le compte. Réessaie." };
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
    return { error: "Compte créé mais la configuration a échoué. Contacte le support." };
  }

  try {
    await sendSignupWelcomeEmail(email);
  } catch (emailError) {
    console.error("Welcome email failed:", emailError);
  }

  if (!data.session) {
    return {
      message: "Compte créé. Vérifie ton email pour confirmer, puis connecte-toi.",
      redirectTo: "/login",
    };
  }

  return { redirectTo: "/dashboard" };
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
    return { error: "Indique ton email et ton mot de passe." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  return { redirectTo: next.startsWith("/") ? next : "/dashboard" };
}

export async function requestPasswordReset(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    return { error: "Indique ton adresse email." };
  }

  const supabase = await createClient();
  const redirectTo = `${getAppUrl()}/auth/callback?next=${encodeURIComponent("/reset-password")}`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) {
    return { error: error.message };
  }

  return {
    message:
      "Si un compte existe avec cet email, tu recevras un lien pour choisir un nouveau mot de passe.",
  };
}

export async function updatePassword(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Lien expiré ou invalide. Demande un nouveau lien de réinitialisation.",
      redirectTo: "/login/forgot-password",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return { redirectTo: "/dashboard" };
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

  return { redirectTo: "/dashboard" };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
