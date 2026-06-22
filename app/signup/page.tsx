import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SignupForm } from "@/components/auth/SignupForm";
import { StravaSetupBanner } from "@/components/auth/StravaSetupBanner";
import { stravaErrorMessage } from "@/lib/strava/errors";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ strava?: string }>;
}) {
  const params = await searchParams;
  const stravaMessage = stravaErrorMessage(params.strava);

  return (
    <>
      <Navbar />
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
    </>
  );
}
