import { Footer } from "@/components/layout/Footer";
import { LandingNav } from "@/components/landing/LandingNav";
import { SignupForm } from "@/components/auth/SignupForm";
import { StravaSetupBanner } from "@/components/auth/StravaSetupBanner";
import { stravaErrorMessage } from "@/lib/strava/errors";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ strava?: string }>;
}) {
  const params = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const stravaMessage = stravaErrorMessage(params.strava);

  return (
    <div className="lp">
      <LandingNav variant="solid" />
      <main className="auth-page">
        <StravaSetupBanner />
        {stravaMessage && (
          <p className="auth-error auth-page-error" role="alert">
            {stravaMessage}
          </p>
        )}
        <SignupForm />
      </main>
      <Footer />
    </div>
  );
}
