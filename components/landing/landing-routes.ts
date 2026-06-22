import { buildRouteCircuitSchema, type RouteCircuitSchema } from "@/lib/route-circuit-schema";
import type { Route } from "@/types/route";

export interface LandingRoutePreview {
  id: string;
  label: string;
  title: string;
  world: string;
  href: string;
  stats: { distance: string; elevation: string; time: string };
  schema: RouteCircuitSchema;
}

function route(data: Omit<Route, "id"> & { id: string }): Route {
  return data;
}

const ROUTE_DATA = [
  {
    id: "landing-endurance",
    label: "Endurance",
    title: "Alpine endurance loop",
    world: "Innsbruck",
    href: "/app",
    stats: { distance: "72 km", elevation: "890 m", time: "~3h 10" },
    route: route({
      id: "landing-endurance",
      route_name: "Alpine endurance loop",
      world: "Innsbruck",
      continent: "Europe",
      distance_km: 72,
      elevation_m: 890,
      difficulty: "hard",
      estimated_time_beginner: 220,
      estimated_time_intermediate: 190,
      estimated_time_advanced: 165,
      estimated_time_competitive: 150,
      training_tags: ["endurance"],
    }),
    seed: 401,
  },
  {
    id: "landing-climb",
    label: "Climbing",
    title: "Col du Tourmalet approach",
    world: "France",
    href: "/app",
    stats: { distance: "45 km", elevation: "1,420 m", time: "~2h 45" },
    route: route({
      id: "landing-climb",
      route_name: "Col du Tourmalet approach",
      world: "France",
      continent: "Europe",
      distance_km: 45,
      elevation_m: 1420,
      difficulty: "epic",
      estimated_time_beginner: 200,
      estimated_time_intermediate: 165,
      estimated_time_advanced: 140,
      estimated_time_competitive: 125,
      training_tags: ["climbing", "challenge"],
    }),
    seed: 538,
  },
  {
    id: "landing-recovery",
    label: "Recovery",
    title: "Coastal recovery spin",
    world: "Watopia",
    href: "/app",
    stats: { distance: "32 km", elevation: "180 m", time: "~1h 05" },
    route: route({
      id: "landing-recovery",
      route_name: "Coastal recovery spin",
      world: "Watopia",
      continent: "Fantasy",
      distance_km: 32,
      elevation_m: 180,
      difficulty: "easy",
      estimated_time_beginner: 75,
      estimated_time_intermediate: 65,
      estimated_time_advanced: 55,
      estimated_time_competitive: 50,
      training_tags: ["recovery"],
    }),
    seed: 675,
  },
  {
    id: "landing-indoor",
    label: "Zwift match",
    title: "Douce France",
    world: "France",
    href: "/app",
    stats: { distance: "23 km", elevation: "410 m", time: "~55 min" },
    route: route({
      id: "landing-indoor",
      route_name: "Douce France",
      world: "France",
      continent: "Europe",
      distance_km: 23,
      elevation_m: 410,
      difficulty: "moderate",
      estimated_time_beginner: 65,
      estimated_time_intermediate: 55,
      estimated_time_advanced: 48,
      estimated_time_competitive: 42,
      training_tags: ["endurance"],
    }),
    seed: 812,
  },
] as const;

export const LANDING_ROUTES: LandingRoutePreview[] = ROUTE_DATA.map((item) => ({
  id: item.id,
  label: item.label,
  title: item.title,
  world: item.world,
  href: item.href,
  stats: item.stats,
  schema: buildRouteCircuitSchema(item.route, item.seed),
}));
