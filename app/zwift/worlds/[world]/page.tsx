import { notFound } from "next/navigation";
import { SeoHero, SeoLinkGrid, SeoSection } from "@/components/seo/SeoBlocks";
import { SeoPageShell } from "@/components/seo/SeoPageShell";
import { zwiftWorldDescription, zwiftWorldTitle } from "@/lib/seo/content";
import {
  getSeoZwiftRoutesByWorld,
  getSeoZwiftWorlds,
  zwiftRoutePath,
  zwiftWorldPath,
} from "@/lib/seo/data/zwift";
import { worldSlug } from "@/lib/seo/slug";
import { breadcrumbJsonLd, JsonLd, webPageJsonLd } from "@/lib/seo/json-ld";
import { seoMetadata } from "@/lib/seo/metadata";

type PageProps = {
  params: Promise<{ world: string }>;
};

export async function generateStaticParams() {
  return getSeoZwiftWorlds().map((world) => ({ world: worldSlug(world) }));
}

export async function generateMetadata({ params }: PageProps) {
  const { world: worldParam } = await params;
  const world = getSeoZwiftWorlds().find((entry) => worldSlug(entry) === worldParam);
  if (!world) return {};

  const routes = getSeoZwiftRoutesByWorld(world);
  const path = zwiftWorldPath(world);
  return seoMetadata({
    title: zwiftWorldTitle(world),
    description: zwiftWorldDescription(world, routes.length),
    path,
  });
}

export default async function ZwiftWorldSeoPage({ params }: PageProps) {
  const { world: worldParam } = await params;
  const world = getSeoZwiftWorlds().find((entry) => worldSlug(entry) === worldParam);
  if (!world) notFound();

  const routes = getSeoZwiftRoutesByWorld(world);
  const path = zwiftWorldPath(world);

  return (
    <SeoPageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Zwift", href: "/zwift" },
        { label: world },
      ]}
    >
      <JsonLd
        data={[
          webPageJsonLd({
            title: zwiftWorldTitle(world),
            description: zwiftWorldDescription(world, routes.length),
            path,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Zwift", path: "/zwift" },
            { name: world, path },
          ]),
        ]}
      />
      <SeoHero
        eyebrow="Zwift world"
        title={zwiftWorldTitle(world)}
        description={zwiftWorldDescription(world, routes.length)}
        primaryHref="/app"
        primaryLabel="Find your next Zwift route"
        secondaryHref="/training"
        secondaryLabel="Browse training plans"
      />
      <SeoSection title={`Routes in ${world}`}>
        <SeoLinkGrid
          title={`${routes.length} Zwift routes`}
          links={routes.map((route) => ({
            href: zwiftRoutePath(route),
            label: route.route_name,
            meta: `${route.distance_km} km · ${route.elevation_m} m`,
          }))}
        />
      </SeoSection>
    </SeoPageShell>
  );
}
