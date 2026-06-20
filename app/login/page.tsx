import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") ? params.next : "/dashboard";

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <LoginForm nextPath={nextPath} />
        {params.error === "auth" && (
          <p className="auth-error auth-page-error" role="alert">
            Authentication failed. Please try again.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
