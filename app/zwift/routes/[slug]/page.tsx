import { notFound } from "next/navigation";
import { SeoCopy, SeoFaq, SeoHero, SeoLinkGrid, SeoSection } from "@/components/seo/SeoBlocks";
import { SeoPageShell } from "@/components/seo/SeoPageShell";
import {
  zwiftRouteDescription,
  zwiftRouteFaqs,
  zwiftRouteIntro,
  zwiftRouteTitle,
} from "@/lib/seo/content";
import {
  getSeoZwiftRoute,
  getSeoZwiftRoutes,
  relatedZwiftRoutes,
  zwiftRoutePath,
  zwiftWorldPath,
} from "@/lib/seo/data/zwift";
import { breadcrumbJsonLd, faqJsonLd, JsonLd, webPageJsonLd } from "@/lib/seo/json-ld";
import { seoMetadata } from "@/lib/seo/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getSeoZwiftRoutes().map((route) => ({ slug: route.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const route = getSeoZwiftRoute(slug);
  if (!route) return {};

  const path = zwiftRoutePath(route);
  return seoMetadata({
    title: zwiftRouteTitle(route),
    description: zwiftRouteDescription(route),
    path,
    keywords: [`${route.route_name} zwift`, `${route.world} zwift route`, "zwift route finder"],
  });
}

export default async function ZwiftRouteSeoPage({ params }: PageProps) {
  const { slug } = await params;
  const route = getSeoZwiftRoute(slug);
  if (!route) notFound();

  const path = zwiftRoutePath(route);
  const faqs = zwiftRouteFaqs(route);
  const related = relatedZwiftRoutes(route);

  return (
    <SeoPageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Zwift", href: "/zwift" },
        { label: route.route_name },
      ]}
    >
      <JsonLd
        data={[
          webPageJsonLd({
            title: zwiftRouteTitle(route),
            description: zwiftRouteDescription(route),
            path,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Zwift", path: "/zwift" },
            { name: route.route_name, path },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <SeoHero
        eyebrow={`${route.world} · ${route.difficulty}`}
        title={zwiftRouteTitle(route)}
        description={zwiftRouteDescription(route)}
        primaryHref={`/app?world=${encodeURIComponent(route.world)}`}
        primaryLabel="Find similar Zwift routes"
        secondaryHref={zwiftWorldPath(route.world)}
        secondaryLabel={`More routes in ${route.world}`}
      />
      <SeoSection title="Route overview">
        <SeoCopy paragraphs={zwiftRouteIntro(route)} />
        <div className="seo-stats">
          <div className="seo-stat">
            <strong>{route.distance_km} km</strong>
            <span>Distance</span>
          </div>
          <div className="seo-stat">
            <strong>{route.elevation_m} m</strong>
            <span>Elevation</span>
          </div>
          <div className="seo-stat">
            <strong>{route.estimated_time_intermediate} min</strong>
            <span>Intermediate time</span>
          </div>
        </div>
      </SeoSection>
      <SeoLinkGrid
        title="Similar Zwift routes"
        links={related.map((entry) => ({
          href: zwiftRoutePath(entry),
          label: entry.route_name,
          meta: `${entry.world} · ${entry.distance_km} km`,
        }))}
      />
      <SeoFaq title={`${route.route_name} FAQ`} items={faqs} />
    </SeoPageShell>
  );
}
