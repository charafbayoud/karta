import { ClosingCTA } from "@/components/landing/ClosingCTA";
import { DestinationsSection } from "@/components/landing/DestinationsSection";
import { FeatureSpotlight } from "@/components/landing/FeatureSpotlight";
import { HeroSection } from "@/components/landing/HeroSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { RoutePreview } from "@/components/landing/RoutePreview";
import { SecondaryGrid } from "@/components/landing/SecondaryGrid";
import { SocialProofBar } from "@/components/landing/SocialProofBar";
import { getOptionalUser } from "@/lib/auth/require-user";

export default async function HomePage() {
  const user = await getOptionalUser();
  const isAuthenticated = Boolean(user);

  return (
    <div className="lp">
      <LandingNav isAuthenticated={isAuthenticated} />
      <main id="main">
        <HeroSection />
        <RoutePreview />
        <SocialProofBar />
        <FeatureSpotlight />
        <SecondaryGrid />
        <DestinationsSection />
        <ClosingCTA />
      </main>
      <LandingFooter isAuthenticated={isAuthenticated} />
    </div>
  );
}
