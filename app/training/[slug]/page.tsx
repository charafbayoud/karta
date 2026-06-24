import { notFound } from "next/navigation";
import { SeoCopy, SeoFaq, SeoHero, SeoLinkGrid, SeoSection } from "@/components/seo/SeoBlocks";
import { SeoPageShell } from "@/components/seo/SeoPageShell";
import {
  trainingDescription,
  trainingFaqs,
  trainingIntro,
  trainingTitle,
} from "@/lib/seo/content";
import {
  getSeoTrainingPage,
  getSeoTrainingPages,
  relatedTrainingPages,
  trainingAppQuery,
  trainingGoalLabel,
  trainingLevelLabel,
  trainingPagePath,
} from "@/lib/seo/data/training";
import { recommendRoute } from "@/lib/recommend";
import { getSeedRoutes } from "@/lib/seed-routes";
import { AVAILABLE_TIME_OPTIONS, type AvailableTime } from "@/types/route";
import { breadcrumbJsonLd, faqJsonLd, JsonLd, webPageJsonLd } from "@/lib/seo/json-ld";
import { seoMetadata } from "@/lib/seo/metadata";
import { zwiftRoutePath } from "@/lib/seo/data/zwift";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function closestAvailableTime(minutes: number): AvailableTime {
  return AVAILABLE_TIME_OPTIONS.reduce((best, value) =>
    Math.abs(value - minutes) < Math.abs(best - minutes) ? value : best
  );
}

export async function generateStaticParams() {
  return getSeoTrainingPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoTrainingPage(slug);
  if (!page) return {};

  const path = trainingPagePath(page);
  return seoMetadata({
    title: trainingTitle(page),
    description: trainingDescription(page),
    path,
  });
}

export default async function TrainingSeoPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoTrainingPage(slug);
  if (!page) notFound();

  const path = trainingPagePath(page);
  const faqs = trainingFaqs(page);
  const related = relatedTrainingPages(page);

  let recommendedRoute = null;
  try {
    const result = recommendRoute(getSeedRoutes(), {
      availableTime: closestAvailableTime(page.minutes),
      riderLevel: page.level,
      trainingGoal: page.goal,
    });
    recommendedRoute = result.route;
  } catch {
    recommendedRoute = null;
  }

  return (
    <SeoPageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Training", href: "/training" },
        { label: `${trainingGoalLabel(page.goal)} · ${page.minutes} min` },
      ]}
    >
      <JsonLd
        data={[
          webPageJsonLd({
            title: trainingTitle(page),
            description: trainingDescription(page),
            path,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Training", path: "/training" },
            { name: trainingTitle(page), path },
          ]),
          faqJsonLd(faqs),
        ]}
      />
      <SeoHero
        eyebrow={`${trainingGoalLabel(page.goal)} · ${trainingLevelLabel(page.level)} · ${page.minutes} min`}
        title={trainingTitle(page)}
        description={trainingDescription(page)}
        primaryHref={trainingAppQuery(page)}
        primaryLabel="Start Zwift route quiz"
        secondaryHref="/zwift"
        secondaryLabel="Browse Zwift routes"
      />
      <SeoSection title="Workout overview">
        <SeoCopy paragraphs={trainingIntro(page)} />
      </SeoSection>
      {recommendedRoute && (
        <SeoSection title="Example Zwift route match">
          <div className="seo-stats">
            <div className="seo-stat">
              <strong>{recommendedRoute.route_name}</strong>
              <span>{recommendedRoute.world}</span>
            </div>
            <div className="seo-stat">
              <strong>{recommendedRoute.distance_km} km</strong>
              <span>{recommendedRoute.elevation_m} m elevation</span>
            </div>
            <div className="seo-stat">
              <strong>{recommendedRoute.difficulty}</strong>
              <span>{recommendedRoute.training_tags.join(", ")}</span>
            </div>
          </div>
        </SeoSection>
      )}
      <SeoLinkGrid
        title="Related training plans"
        links={related.map((entry) => ({
          href: trainingPagePath(entry),
          label: `${trainingGoalLabel(entry.goal)} · ${entry.minutes} min`,
          meta: trainingLevelLabel(entry.level),
        }))}
      />
      {recommendedRoute && (
        <SeoLinkGrid
          title="Featured Zwift route"
          links={[
            {
              href: zwiftRoutePath(recommendedRoute),
              label: recommendedRoute.route_name,
              meta: recommendedRoute.world,
            },
          ]}
        />
      )}
      <SeoFaq title="Training FAQ" items={faqs} />
    </SeoPageShell>
  );
}
