import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Trust } from "@/components/landing/Trust";
import { Benefits } from "@/components/landing/Benefits";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ComingSoon } from "@/components/landing/ComingSoon";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <Header />
      <Hero />
      <Trust />
      <Benefits />
      <HowItWorks />
      <ComingSoon />
      <FinalCTA />
      <footer className="landing-footer">
        <p>
          © {new Date().getFullYear()} KARTA · Built for Zwift riders. ·{" "}
          <Link href="/app" className="landing-dev-link">
            Open App
          </Link>
        </p>
      </footer>
    </main>
  );
}
