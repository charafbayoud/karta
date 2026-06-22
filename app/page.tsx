import { ClosingCTA } from "@/components/landing/ClosingCTA";
import { DestinationsSection } from "@/components/landing/DestinationsSection";
import { FeatureSpotlight } from "@/components/landing/FeatureSpotlight";
import { HeroSection } from "@/components/landing/HeroSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { RoutePreview } from "@/components/landing/RoutePreview";
import { SecondaryGrid } from "@/components/landing/SecondaryGrid";
import { SocialProofBar } from "@/components/landing/SocialProofBar";

export default function HomePage() {
  return (
    <div className="lp">
      <LandingNav />
      <main id="main">
        <HeroSection />
        <RoutePreview />
        <SocialProofBar />
        <FeatureSpotlight />
        <SecondaryGrid />
        <DestinationsSection />
        <ClosingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
