import { Footer } from "@/components/layout/Footer";
import { LandingNav } from "@/components/landing/LandingNav";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login/forgot-password?error=expired");
  }

  return (
    <div className="lp">
      <LandingNav variant="solid" />
      <main className="auth-page">
        <ResetPasswordForm />
      </main>
      <Footer />
    </div>
  );
}
