import type { Route } from "@/types/route";
import type { SeoCity } from "@/lib/seo/types";
import type { SeoDistancePage } from "@/lib/seo/types";
import type { SeoTrainingPage } from "@/lib/seo/types";
import { formatKm, formatMiles } from "@/lib/seo/units";
import {
  sportTitle,
  sportLabel,
} from "@/lib/seo/data/distances";
import {
  trainingGoalLabel,
  trainingLevelLabel,
} from "@/lib/seo/data/training";

export function cityTitle(city: SeoCity): string {
  return `Cycling Routes in ${city.name}, ${city.country}`;
}

export function cityDescription(city: SeoCity): string {
  return `Plan outdoor cycling, running, and walking loops in ${city.name}. Generate GPX-ready routes with KARTA's loop builder for ${city.region}.`;
}

export function cityIntro(city: SeoCity): string[] {
  return [
    `Looking for a ${sportLabel("cycling")} loop in ${city.name}? KARTA helps you drop a pin anywhere in ${city.name}, ${city.country}, and generate a realistic outdoor route using nearby segments and road data.`,
    `Whether you want a short recovery spin or a long endurance ride around ${city.name}, set your distance in kilometers or miles and export a route you can follow on your bike computer or running watch.`,
    `Start from ${city.name} with one click — no manual map drawing required.`,
  ];
}

export function cityFaqs(city: SeoCity) {
  return [
    {
      question: `Can I generate a cycling loop in ${city.name}?`,
      answer: `Yes. Open KARTA's outdoor route generator, center the map on ${city.name}, choose your sport and distance, and build a loop instantly.`,
    },
    {
      question: `Does KARTA work for running and walking in ${city.name}?`,
      answer: `Yes. KARTA supports cycling, running, and walking loops in ${city.name} with distance presets in both km and miles.`,
    },
    {
      question: `Can I export routes from ${city.name}?`,
      answer: `Saved outdoor routes can be exported for use on compatible devices and apps after you create a free KARTA account.`,
    },
  ];
}

export function distanceTitle(page: SeoDistancePage): string {
  const sport = sportTitle(page.sport);
  if (page.unitSlug === "km") {
    return `${formatKm(page.valueKm)} ${sport} Route Generator`;
  }
  return `${formatMiles(page.valueMiles)} ${sport} Route Generator`;
}

export function distanceDescription(page: SeoDistancePage): string {
  const sport = sportTitle(page.sport).toLowerCase();
  return `Plan a ${formatKm(page.valueKm)} (${formatMiles(page.valueMiles)}) ${sport} loop with KARTA. Drop a pin in any city and generate GPX-ready outdoor routes.`;
}

export function distanceIntro(page: SeoDistancePage): string[] {
  const sport = sportTitle(page.sport).toLowerCase();
  return [
    `Need a ${formatKm(page.valueKm)} ${sport} route — about ${formatMiles(page.valueMiles)}? KARTA builds realistic outdoor loops from your location instead of forcing you to draw a course by hand.`,
    `Set ${formatKm(page.valueKm)} as your target distance, pick ${sport}, and generate a loop that respects roads and popular segments near your pin.`,
    `Every ${sport} distance page supports both kilometers and miles so you can train with the units you use on your device.`,
  ];
}

export function distanceFaqs(page: SeoDistancePage) {
  const sport = sportTitle(page.sport).toLowerCase();
  return [
    {
      question: `How do I plan a ${formatKm(page.valueKm)} ${sport} route?`,
      answer: `Open KARTA Outdoor, drop a pin on your start point, select ${sport}, set the distance to ${formatKm(page.valueKm)} (${formatMiles(page.valueMiles)}), and generate your loop.`,
    },
    {
      question: `Can I use miles instead of kilometers?`,
      answer: `Yes. This page targets ${formatKm(page.valueKm)}, which equals ${formatMiles(page.valueMiles)}. KARTA accepts both units when building routes.`,
    },
    {
      question: `Does this work for Zwift indoor rides?`,
      answer: `For indoor training, use KARTA's Zwift route finder to match a similar duration and training goal on a curated virtual route.`,
    },
  ];
}

export function trainingTitle(page: SeoTrainingPage): string {
  return `${page.minutes}-Minute Zwift ${trainingGoalLabel(page.goal)} Workout for ${trainingLevelLabel(page.level)} Riders`;
}

export function trainingDescription(page: SeoTrainingPage): string {
  return `Find the best Zwift route for a ${page.minutes}-minute ${trainingGoalLabel(page.goal).toLowerCase()} session at ${trainingLevelLabel(page.level).toLowerCase()} level with KARTA's route quiz.`;
}

export function trainingIntro(page: SeoTrainingPage): string[] {
  const goal = trainingGoalLabel(page.goal).toLowerCase();
  const level = trainingLevelLabel(page.level).toLowerCase();
  return [
    `This ${page.minutes}-minute Zwift plan focuses on ${goal} training for ${level} riders. KARTA matches real Zwift routes to your available time, fitness level, and training goal.`,
    `Instead of scrolling every world in Zwift, answer three questions — or use this pre-built ${goal} preset — and get a route with distance, elevation, and estimated duration.`,
    `Routes are selected from KARTA's catalog of 120+ curated Zwift courses with tags for climbing, endurance, recovery, and epic challenges.`,
  ];
}

export function trainingFaqs(page: SeoTrainingPage) {
  const goal = trainingGoalLabel(page.goal).toLowerCase();
  return [
    {
      question: `What is a good Zwift ${goal} workout for ${page.minutes} minutes?`,
      answer: `Use KARTA's route finder with goal "${page.goal}", level "${page.level}", and ${page.minutes} minutes available. You'll get a Zwift route aligned to your target.`,
    },
    {
      question: `Do I need Strava for indoor routes?`,
      answer: `No. The Zwift route quiz works with email signup. Connect Strava later if you want outdoor segment-based loops.`,
    },
    {
      question: `Can I adjust the workout if the route is too long?`,
      answer: `KARTA picks the closest match to your time and goal. You can rerun the quiz with different minutes or levels for alternatives.`,
    },
  ];
}

export function zwiftRouteTitle(route: Route): string {
  return `${route.route_name} — Zwift Route in ${route.world}`;
}

export function zwiftRouteDescription(route: Route): string {
  return `${route.route_name} on Zwift (${route.world}): ${route.distance_km} km, ${route.elevation_m} m elevation, ${route.difficulty} difficulty. Find similar routes with KARTA.`;
}

export function zwiftRouteIntro(route: Route): string[] {
  return [
    `${route.route_name} is a ${route.difficulty} Zwift route in ${route.world}, covering ${route.distance_km} km with ${route.elevation_m} meters of climbing.`,
    `Estimated ride time ranges from ${route.estimated_time_beginner} minutes for beginners to ${route.estimated_time_competitive} minutes for competitive riders.`,
    `Use KARTA to find ${route.route_name} and similar Zwift routes matched to your training goal, rider level, and available time.`,
  ];
}

export function zwiftRouteFaqs(route: Route) {
  return [
    {
      question: `How long is ${route.route_name} on Zwift?`,
      answer: `${route.route_name} is ${route.distance_km} km with about ${route.elevation_m} m of elevation in ${route.world}. Beginners typically finish in ${route.estimated_time_beginner} minutes.`,
    },
    {
      question: `What training tags fit ${route.route_name}?`,
      answer: `This route is tagged for ${route.training_tags.join(", ")} sessions on Zwift.`,
    },
    {
      question: `How do I find routes like ${route.route_name}?`,
      answer: `Run KARTA's Zwift route quiz and filter by time, level, and goal to discover similar courses in ${route.world} and other worlds.`,
    },
  ];
}

export function zwiftWorldTitle(world: string): string {
  return `Zwift Routes in ${world}`;
}

export function zwiftWorldDescription(world: string, routeCount: number): string {
  return `Browse ${routeCount} Zwift routes in ${world}. Compare distance, elevation, and difficulty, then find your next indoor ride with KARTA.`;
}
