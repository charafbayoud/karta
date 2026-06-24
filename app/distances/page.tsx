import Link from "next/link";
import { SeoPageShell } from "@/components/seo/SeoPageShell";
import { SeoLinkGrid } from "@/components/seo/SeoBlocks";
import {
  distanceSportSlugs,
  featuredDistancePages,
  getSeoDistancePages,
  sportTitle,
} from "@/lib/seo/data/distances";
import { seoMetadata } from "@/lib/seo/metadata";

export const metadata = seoMetadata({
  title: "Route Distances in Kilometers and Miles",
  description:
    "Browse cycling, running, and walking route distances in km and miles. Generate outdoor loops for every preset with KARTA.",
  path: "/distances",
});

export default async function DistancesHubPage() {
  const total = getSeoDistancePages().length;

  return (
    <SeoPageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Distances" }]}>
      <header className="seo-hero">
        <p className="karta-label">Programmatic SEO</p>
        <h1>Route distances in km and miles</h1>
        <p className="seo-hub-intro">
          Explore {total} distance presets across cycling, running, and walking — each page includes both
          kilometers and miles for international riders and runners.
        </p>
        <Link href="/outdoor" className="btn-primary">
          Open outdoor route generator
        </Link>
      </header>
      {distanceSportSlugs().map((sport) => (
        <SeoLinkGrid
          key={sport}
          title={`${sportTitle(sport)} distances`}
          links={featuredDistancePages(100)
            .filter((page) => page.sport === sport && page.unitSlug === "km")
            .slice(0, 18)
            .map((page) => ({
              href: `/distances/${page.sport}/${page.slug}`,
              label: `${page.displayValue} km`,
              meta: `${page.valueMiles} mi`,
            }))}
        />
      ))}
    </SeoPageShell>
  );
}
