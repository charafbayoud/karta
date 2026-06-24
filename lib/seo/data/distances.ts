import type { PrimarySport } from "@/types/user";
import { kmToMiles } from "@/lib/seo/units";
import type { SeoDistancePage } from "@/lib/seo/types";

function cyclingDistances(): number[] {
  const values: number[] = [];
  for (let km = 10; km <= 200; km += 2) values.push(km);
  return values.slice(0, 100);
}

function runningDistances(): number[] {
  const values: number[] = [];
  for (let km = 3; km <= 50; km += 0.5) {
    values.push(Math.round(km * 10) / 10);
    if (values.length >= 100) break;
  }
  return values.slice(0, 100);
}

function walkingDistances(): number[] {
  const values: number[] = [];
  for (let km = 1; km <= 20; km += 0.2) {
    values.push(Math.round(km * 10) / 10);
    if (values.length >= 100) break;
  }
  return values.slice(0, 100);
}

function buildSportPages(
  sport: PrimarySport,
  kmValues: number[],
  unit: "km" | "mi"
): SeoDistancePage[] {
  return kmValues.map((valueKm) => {
    const valueMiles = kmToMiles(valueKm);
    const displayValue = unit === "km" ? valueKm : valueMiles;
    const slug = `${sport}-${String(displayValue).replace(".", "-")}${unit}`;

    return {
      slug,
      sport,
      valueKm,
      valueMiles,
      unitSlug: unit,
      displayValue,
    };
  });
}

/** 600 pages: 100 km-slugs + 100 mi-slugs per sport (cycling, running, walking). */
export function getSeoDistancePages(): SeoDistancePage[] {
  const sports: Array<{ sport: PrimarySport; values: number[] }> = [
    { sport: "cycling", values: cyclingDistances() },
    { sport: "running", values: runningDistances() },
    { sport: "walking", values: walkingDistances() },
  ];

  const pages: SeoDistancePage[] = [];

  for (const { sport, values } of sports) {
    pages.push(...buildSportPages(sport, values, "km"));
    pages.push(...buildSportPages(sport, values, "mi"));
  }

  return pages;
}

export function getSeoDistancePage(slug: string): SeoDistancePage | undefined {
  return getSeoDistancePages().find((page) => page.slug === slug);
}

export function distancePagePath(page: SeoDistancePage): string {
  return `/distances/${page.sport}/${page.slug}`;
}

export function sportLabel(sport: PrimarySport): string {
  if (sport === "cycling") return "cycling";
  if (sport === "running") return "running";
  return "walking";
}

export function sportTitle(sport: PrimarySport): string {
  if (sport === "cycling") return "Cycling";
  if (sport === "running") return "Running";
  return "Walking";
}

export function uniqueDistanceSlugsForStaticParams(): string[] {
  return getSeoDistancePages().map((page) => page.slug);
}

export function distanceSportSlugs(): PrimarySport[] {
  return ["cycling", "running", "walking"];
}

export function getDistancePagesBySport(sport: PrimarySport): SeoDistancePage[] {
  return getSeoDistancePages().filter((page) => page.sport === sport);
}

/** Hub list: first 50 km-based cycling pages. */
export function featuredDistancePages(limit = 24): SeoDistancePage[] {
  return getSeoDistancePages()
    .filter((page) => page.unitSlug === "km")
    .slice(0, limit);
}

export function relatedDistancePages(page: SeoDistancePage, limit = 6): SeoDistancePage[] {
  return getSeoDistancePages()
    .filter((candidate) => candidate.sport === page.sport && candidate.slug !== page.slug)
    .slice(0, limit);
}
