import { notFound } from "next/navigation";
import type { PrimarySport } from "@/types/user";
import { SeoCopy, SeoFaq, SeoHero, SeoLinkGrid, SeoSection } from "@/components/seo/SeoBlocks";
import { SeoPageShell } from "@/components/seo/SeoPageShell";
import {
  distanceDescription,
  distanceFaqs,
  distanceIntro,
  distanceTitle,
} from "@/lib/seo/content";
import {
  distancePagePath,
  getSeoDistancePage,
  getSeoDistancePages,
  relatedDistancePages,
  sportTitle,
} from "@/lib/seo/data/distances";
import { breadcrumbJsonLd, faqJsonLd, JsonLd, webPageJsonLd } from "@/lib/seo/json-ld";
import { seoMetadata } from "@/lib/seo/metadata";
import { formatKm, formatMiles } from "@/lib/seo/units";

type PageProps = {
  params: Promise<{ sport: PrimarySport; slug: string }>;
};

export async function generateStaticParams() {
  return getSeoDistancePages().map((page) => ({
    sport: page.sport,
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { sport, slug } = await params;
  const page = getSeoDistancePage(slug);
  if (!page || page.sport !== sport) return {};

  const path = distancePagePath(page);
  return seoMetadata({
    title: distanceTitle(page),
    description: distanceDescription(page),
    path,
  });
}

export default async function DistanceSeoPage({ params }: PageProps) {
  const { sport, slug } = await params;
  const page = getSeoDistancePage(slug);
  if (!page || page.sport !== sport) notFound();

  const path = distancePagePath(page);
  const faqs = distanceFaqs(page);
  const related = relatedDistancePages(page);

  return (
    <SeoPageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Distances", href: "/distances" },
        { label: `${sportTitle(page.sport)} · ${page.displayValue} ${page.unitSlug}` },
      ]}
    >
      <JsonLd
        data={[
          webPageJsonLd({
            title: distanceTitle(page),
            description: distanceDescription(page),
            path,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Distances", path: "/distances" },
            { name: distanceTitle(page), path },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <SeoHero
        eyebrow={`${sportTitle(page.sport)} · ${formatKm(page.valueKm)} / ${formatMiles(page.valueMiles)}`}
        title={distanceTitle(page)}
        description={distanceDescription(page)}
        primaryHref={`/outdoor?distance=${page.valueKm}&sport=${page.sport}`}
        primaryLabel="Generate this loop"
        secondaryHref="/app"
        secondaryLabel="Find a Zwift route"
      />
      <SeoSection title="Distance planning">
        <SeoCopy paragraphs={distanceIntro(page)} />
      </SeoSection>
      <SeoLinkGrid
        title={`Similar ${sportTitle(page.sport).toLowerCase()} distances`}
        links={related.map((entry) => ({
          href: distancePagePath(entry),
          label: `${entry.displayValue} ${entry.unitSlug}`,
          meta: `${formatKm(entry.valueKm)} · ${formatMiles(entry.valueMiles)}`,
        }))}
      />
      <SeoFaq title="Distance FAQ" items={faqs} />
    </SeoPageShell>
  );
}
