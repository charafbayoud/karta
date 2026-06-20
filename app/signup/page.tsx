import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="auth-page">
        <SignupForm />
      </main>
      <Footer />
    </>
  );
}
