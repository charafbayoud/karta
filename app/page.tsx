import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Features } from "@/components/vitrine/Features";
import { Hero } from "@/components/vitrine/Hero";
import { PlatformCards } from "@/components/vitrine/PlatformCards";
import { SocialProof } from "@/components/vitrine/SocialProof";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PlatformCards />
        <Features />
        <SocialProof />
      </main>
      <Footer />
    </>
  );
}
