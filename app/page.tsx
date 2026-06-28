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
import { JsonLd, organizationJsonLd, webPageJsonLd } from "@/lib/seo/json-ld";
import { seoMetadata } from "@/lib/seo/metadata";

export const metadata = seoMetadata({
  title: "KARTA — Zwift Route Finder & Outdoor Loop Generator",
  description:
    "Find the right Zwift route for every workout and generate outdoor cycling, running, and walking loops in any city.",
  path: "/",
  keywords: ["zwift route finder", "cycling loop generator", "outdoor route planner", "gpx routes"],
});

export default async function HomePage() {
  const user = await getOptionalUser();
  const isAuthenticated = Boolean(user);

  return (
    <div className="lp">
      <JsonLd
        data={[
          organizationJsonLd(),
          webPageJsonLd({
            title: "KARTA — Zwift Route Finder & Outdoor Loop Generator",
            description:
              "Find the right Zwift route for every workout and generate outdoor cycling, running, and walking loops in any city.",
            path: "/",
          }),
        ]}
      />
      <LandingNav isAuthenticated={isAuthenticated} variant="overlay" />
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
