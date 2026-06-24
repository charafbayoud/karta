import Link from "next/link";
import { SeoPageShell } from "@/components/seo/SeoPageShell";
import { SeoLinkGrid } from "@/components/seo/SeoBlocks";
import {
  featuredZwiftRoutes,
  getSeoZwiftRoutes,
  getSeoZwiftWorlds,
  zwiftRoutePath,
  zwiftWorldPath,
} from "@/lib/seo/data/zwift";
import { JsonLd, organizationJsonLd } from "@/lib/seo/json-ld";
import { seoMetadata } from "@/lib/seo/metadata";

export const metadata = seoMetadata({
  title: "Zwift Routes — 120 Curated Indoor Rides",
  description:
    "Browse 120 Zwift routes across 10 worlds. Compare distance, elevation, and difficulty, then find your next indoor ride with KARTA.",
  path: "/zwift",
});

export default async function ZwiftHubPage() {
  return (
    <SeoPageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Zwift" }]}>
      <JsonLd data={organizationJsonLd()} />
      <header className="seo-hero">
        <p className="karta-label">Programmatic SEO</p>
        <h1>Zwift route catalog</h1>
        <p className="seo-hub-intro">
          Explore {getSeoZwiftRoutes().length} curated Zwift routes across {getSeoZwiftWorlds().length}{" "}
          worlds. Every route page includes stats, FAQs, and a link into KARTA&apos;s route quiz.
        </p>
        <Link href="/app" className="btn-primary">
          Open Zwift route finder
        </Link>
      </header>
      <SeoLinkGrid
        title="Zwift worlds"
        links={getSeoZwiftWorlds().map((world) => ({
          href: zwiftWorldPath(world),
          label: world,
          meta: `${getSeoZwiftRoutes().filter((route) => route.world === world).length} routes`,
        }))}
      />
      <SeoLinkGrid
        title="Featured Zwift routes"
        links={featuredZwiftRoutes(36).map((route) => ({
          href: zwiftRoutePath(route),
          label: route.route_name,
          meta: `${route.world} · ${route.distance_km} km`,
        }))}
      />
    </SeoPageShell>
  );
}
