import Link from "next/link";
import { SeoPageShell } from "@/components/seo/SeoPageShell";
import { SeoLinkGrid } from "@/components/seo/SeoBlocks";
import { citiesByRegion, featuredCities, getSeoCities } from "@/lib/seo/data/cities";
import { seoMetadata } from "@/lib/seo/metadata";

export const metadata = seoMetadata({
  title: "Cycling Route Cities — Europe & United States",
  description:
    "Browse 300 cities across Europe and the United States to generate outdoor cycling, running, and walking loops with KARTA.",
  path: "/cities",
  keywords: ["cycling cities", "route planner by city", "outdoor loop generator"],
});

export default async function CitiesHubPage() {
  const europe = citiesByRegion("Europe").slice(0, 24);
  const us = citiesByRegion("United States").slice(0, 24);

  return (
    <SeoPageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cities" }]}>
      <header className="seo-hero">
        <p className="karta-label">Programmatic SEO</p>
        <h1>Cycling & running routes by city</h1>
        <p className="seo-hub-intro">
          KARTA covers {getSeoCities().length} cities across Europe and the United States. Pick a city to
          generate outdoor loops in kilometers or miles.
        </p>
        <Link href="/outdoor" className="btn-primary">
          Open outdoor route generator
        </Link>
      </header>
      <SeoLinkGrid
        title="Featured cities in Europe"
        links={europe.map((city) => ({
          href: `/cities/${city.slug}`,
          label: city.name,
          meta: city.country,
        }))}
      />
      <SeoLinkGrid
        title="Featured cities in the United States"
        links={us.map((city) => ({
          href: `/cities/${city.slug}`,
          label: city.name,
          meta: city.country,
        }))}
      />
      <SeoLinkGrid
        title="More cities"
        links={featuredCities(48).map((city) => ({
          href: `/cities/${city.slug}`,
          label: city.name,
          meta: `${city.region} · ${city.country}`,
        }))}
      />
    </SeoPageShell>
  );
}
