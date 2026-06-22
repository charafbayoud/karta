import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LoginForm } from "@/components/auth/LoginForm";
import { StravaSetupBanner } from "@/components/auth/StravaSetupBanner";
import { stravaErrorMessage } from "@/lib/strava/errors";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; reason?: string; strava?: string }>;
}) {
  const params = await searchParams;
  const rawNext = params.next ?? "/dashboard";
  const nextPath = rawNext.startsWith("/") ? decodeURIComponent(rawNext) : "/dashboard";
  const stravaHint =
    params.reason === "strava" || params.strava === "login_required"
      ? "Connecte-toi à KARTA — tu seras ensuite redirigé vers Strava."
      : stravaErrorMessage(params.strava);

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <StravaSetupBanner />
        <LoginForm nextPath={nextPath} />
        {params.error === "auth" && (
          <p className="auth-error auth-page-error" role="alert">
            Authentication failed. Please try again.
          </p>
        )}
        {stravaHint && (
          <p className="auth-page-error" role="status">
            {stravaHint}
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
