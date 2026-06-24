import { getAppUrl } from "@/lib/env";
import { getSeoCities, cityPagePath } from "@/lib/seo/data/cities";
import { getSeoDistancePages, distancePagePath } from "@/lib/seo/data/distances";
import { getSeoTrainingPages, trainingPagePath } from "@/lib/seo/data/training";
import {
  getSeoZwiftRoutes,
  getSeoZwiftWorlds,
  zwiftRoutePath,
  zwiftWorldPath,
} from "@/lib/seo/data/zwift";

export function getAllPublicSeoPaths(): string[] {
  const staticPaths = ["/", "/privacy", "/terms", "/contact", "/cities", "/distances", "/training", "/zwift"];

  const cityPaths = getSeoCities().map(cityPagePath);
  const distancePaths = getSeoDistancePages().map(distancePagePath);
  const trainingPaths = getSeoTrainingPages().map(trainingPagePath);
  const zwiftRoutePaths = getSeoZwiftRoutes().map(zwiftRoutePath);
  const zwiftWorldPaths = getSeoZwiftWorlds().map(zwiftWorldPath);

  return [
    ...staticPaths,
    ...cityPaths,
    ...distancePaths,
    ...trainingPaths,
    ...zwiftRoutePaths,
    ...zwiftWorldPaths,
  ];
}

export function absoluteUrl(path: string): string {
  return `${getAppUrl()}${path}`;
}
