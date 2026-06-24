import { notFound } from "next/navigation";
import { SeoCopy, SeoFaq, SeoHero, SeoLinkGrid, SeoSection } from "@/components/seo/SeoBlocks";
import { SeoPageShell } from "@/components/seo/SeoPageShell";
import {
  cityDescription,
  cityFaqs,
  cityIntro,
  cityTitle,
} from "@/lib/seo/content";
import {
  cityOutdoorQuery,
  cityPagePath,
  getSeoCities,
  getSeoCity,
  relatedCities,
} from "@/lib/seo/data/cities";
import { breadcrumbJsonLd, faqJsonLd, JsonLd, webPageJsonLd } from "@/lib/seo/json-ld";
import { seoMetadata } from "@/lib/seo/metadata";
import { formatKm, formatMiles } from "@/lib/seo/units";
import { featuredDistancePages, sportTitle } from "@/lib/seo/data/distances";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getSeoCities().map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const city = getSeoCity(slug);
  if (!city) return {};

  const path = cityPagePath(city);
  return seoMetadata({
    title: cityTitle(city),
    description: cityDescription(city),
    path,
    keywords: [`cycling routes ${city.name}`, `${city.name} running loop`, `${city.name} GPX route`],
  });
}

export default async function CitySeoPage({ params }: PageProps) {
  const { slug } = await params;
  const city = getSeoCity(slug);
  if (!city) notFound();

  const path = cityPagePath(city);
  const faqs = cityFaqs(city);
  const related = relatedCities(city);
  const distances = featuredDistancePages(6).filter((page) => page.sport === "cycling");

  return (
    <SeoPageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Cities", href: "/cities" },
        { label: city.name },
      ]}
    >
      <JsonLd
        data={[
          webPageJsonLd({ title: cityTitle(city), description: cityDescription(city), path }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Cities", path: "/cities" },
            { name: city.name, path },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <SeoHero
        eyebrow={`${city.region} · ${city.country}`}
        title={cityTitle(city)}
        description={cityDescription(city)}
        primaryHref={cityOutdoorQuery(city, 50)}
        primaryLabel={`Generate a loop in ${city.name}`}
        secondaryHref="/app"
        secondaryLabel="Find a Zwift route"
      />
      <SeoSection title={`Ride planning in ${city.name}`}>
        <SeoCopy paragraphs={cityIntro(city)} />
      </SeoSection>
      <SeoSection title="Suggested distances">
        <div className="seo-stats">
          {distances.map((page) => (
            <div key={page.slug} className="seo-stat">
              <strong>{formatKm(page.valueKm)}</strong>
              <span>{formatMiles(page.valueMiles)} · {sportTitle(page.sport)}</span>
            </div>
          ))}
        </div>
      </SeoSection>
      <SeoLinkGrid
        title={`More cities in ${city.region}`}
        links={related.map((entry) => ({
          href: cityPagePath(entry),
          label: entry.name,
          meta: entry.country,
        }))}
      />
      <SeoFaq title={`${city.name} route FAQ`} items={faqs} />
    </SeoPageShell>
  );
}
