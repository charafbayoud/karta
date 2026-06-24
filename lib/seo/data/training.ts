import {
  RIDER_LEVELS,
  TRAINING_GOALS,
  TRAINING_GOAL_LABELS,
  RIDER_LEVEL_LABELS,
  type RiderLevel,
  type TrainingGoal,
} from "@/types/route";
import type { SeoTrainingPage } from "@/lib/seo/types";

const TRAINING_MINUTES = [20, 25, 30, 35, 40, 45, 50, 55, 60, 75, 90, 105, 120, 135, 150];

export function getSeoTrainingPages(): SeoTrainingPage[] {
  const pages: SeoTrainingPage[] = [];

  for (const goal of TRAINING_GOALS) {
    for (const level of RIDER_LEVELS) {
      for (const minutes of TRAINING_MINUTES) {
        const variant = `${goal}-${level}-${minutes}min`;
        pages.push({
          slug: variant,
          goal,
          level,
          minutes,
          variant,
        });
      }
    }
  }

  return pages;
}

export function getSeoTrainingPage(slug: string): SeoTrainingPage | undefined {
  return getSeoTrainingPages().find((page) => page.slug === slug);
}

export function trainingPagePath(page: SeoTrainingPage): string {
  return `/training/${page.slug}`;
}

export function trainingGoalLabel(goal: TrainingGoal): string {
  return TRAINING_GOAL_LABELS[goal];
}

export function trainingLevelLabel(level: RiderLevel): string {
  return RIDER_LEVEL_LABELS[level];
}

export function featuredTrainingPages(limit = 24): SeoTrainingPage[] {
  return getSeoTrainingPages().slice(0, limit);
}

export function relatedTrainingPages(page: SeoTrainingPage, limit = 6): SeoTrainingPage[] {
  return getSeoTrainingPages()
    .filter(
      (candidate) =>
        candidate.slug !== page.slug &&
        (candidate.goal === page.goal || candidate.minutes === page.minutes)
    )
    .slice(0, limit);
}

export function trainingSearchKeywords(page: SeoTrainingPage): string[] {
  const goal = trainingGoalLabel(page.goal).toLowerCase();
  const level = trainingLevelLabel(page.level).toLowerCase();
  return [
    `${page.minutes} minute zwift ${goal} workout`,
    `zwift ${goal} ${level} ${page.minutes} min`,
    `indoor ${goal} training ${page.minutes} minutes`,
  ];
}

export function trainingAppQuery(page: SeoTrainingPage): string {
  const params = new URLSearchParams({
    goal: page.goal,
    level: page.level,
    time: String(page.minutes),
  });
  return `/app?${params.toString()}`;
}
