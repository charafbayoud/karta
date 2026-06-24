import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const expired = params.error === "expired";

  return (
    <>
      <Navbar />
      <main className="auth-page">
        {expired && (
          <p className="auth-error auth-page-error" role="alert">
            Le lien a expiré ou est invalide. Demande un nouveau lien ci-dessous.
          </p>
        )}
        <ForgotPasswordForm />
      </main>
      <Footer />
    </>
  );
}
