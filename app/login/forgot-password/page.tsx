import { Footer } from "@/components/layout/Footer";
import { LandingNav } from "@/components/landing/LandingNav";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const expired = params.error === "expired";

  return (
    <div className="lp">
      <LandingNav variant="solid" />
      <main className="auth-page">
        {expired && (
          <p className="auth-error auth-page-error" role="alert">
            This link has expired or is invalid. Request a new one below.
          </p>
        )}
        <ForgotPasswordForm />
      </main>
      <Footer />
    </div>
  );
}
