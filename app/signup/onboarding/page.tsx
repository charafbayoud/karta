import { redirect } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { LandingNav } from "@/components/landing/LandingNav";
import { OnboardingForm } from "@/components/auth/OnboardingForm";
import { getCurrentProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getCurrentProfile();
  if (profile?.primary_sport && profile?.primary_experience) {
    redirect("/dashboard");
  }

  return (
    <div className="lp">
      <LandingNav variant="solid" isAuthenticated />
      <main className="auth-page">
        <OnboardingForm />
      </main>
      <Footer />
    </div>
  );
}
