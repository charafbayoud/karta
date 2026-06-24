import Link from "next/link";
import { SeoPageShell } from "@/components/seo/SeoPageShell";
import { SeoLinkGrid } from "@/components/seo/SeoBlocks";
import {
  featuredTrainingPages,
  getSeoTrainingPages,
  trainingGoalLabel,
  trainingLevelLabel,
  trainingPagePath,
} from "@/lib/seo/data/training";
import { seoMetadata } from "@/lib/seo/metadata";

export const metadata = seoMetadata({
  title: "Zwift Training Plans by Goal, Level, and Duration",
  description:
    "Browse 300 Zwift training presets by goal, rider level, and available time. Launch the KARTA route quiz with one click.",
  path: "/training",
});

export default async function TrainingHubPage() {
  return (
    <SeoPageShell breadcrumbs={[{ label: "Home", href: "/" }, { label: "Training" }]}>
      <header className="seo-hero">
        <p className="karta-label">Programmatic SEO</p>
        <h1>Zwift training plans</h1>
        <p className="seo-hub-intro">
          {getSeoTrainingPages().length} presets combine training goal, rider level, and session length.
          Each page links directly into KARTA&apos;s Zwift route quiz.
        </p>
        <Link href="/app" className="btn-primary">
          Open Zwift route finder
        </Link>
      </header>
      <SeoLinkGrid
        title="Featured training presets"
        links={featuredTrainingPages(48).map((page) => ({
          href: trainingPagePath(page),
          label: `${trainingGoalLabel(page.goal)} · ${page.minutes} min`,
          meta: trainingLevelLabel(page.level),
        }))}
      />
    </SeoPageShell>
  );
}
