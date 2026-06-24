import { getSeedRoutes } from "@/lib/seed-routes";
import { worldSlug } from "@/lib/seo/slug";
import type { Route } from "@/types/route";
import type { SeoZwiftRoutePage } from "@/lib/seo/types";

const ZWIFT_ROUTE_LIMIT = 120;

export function getSeoZwiftRoutes(): Route[] {
  return getSeedRoutes()
    .slice()
    .sort((a, b) => a.route_name.localeCompare(b.route_name))
    .slice(0, ZWIFT_ROUTE_LIMIT);
}

export function getSeoZwiftRoute(slug: string): Route | undefined {
  return getSeoZwiftRoutes().find((route) => route.id === slug);
}

export function getSeoZwiftWorlds(): string[] {
  const worlds = new Set(getSeoZwiftRoutes().map((route) => route.world));
  return Array.from(worlds).sort((a, b) => a.localeCompare(b));
}

export function getSeoZwiftRoutesByWorld(world: string): Route[] {
  return getSeoZwiftRoutes().filter((route) => route.world === world);
}

export function zwiftRoutePath(route: Route): string {
  return `/zwift/routes/${route.id}`;
}

export function zwiftWorldPath(world: string): string {
  return `/zwift/worlds/${worldSlug(world)}`;
}

export function getSeoZwiftRoutePages(): SeoZwiftRoutePage[] {
  return getSeoZwiftRoutes().map((route) => ({
    slug: route.id,
    worldSlug: worldSlug(route.world),
  }));
}

export function relatedZwiftRoutes(route: Route, limit = 6): Route[] {
  return getSeoZwiftRoutes()
    .filter(
      (candidate) =>
        candidate.id !== route.id &&
        (candidate.world === route.world ||
          candidate.training_tags.some((tag) => route.training_tags.includes(tag)))
    )
    .slice(0, limit);
}

export function featuredZwiftRoutes(limit = 24): Route[] {
  return getSeoZwiftRoutes().slice(0, limit);
}
