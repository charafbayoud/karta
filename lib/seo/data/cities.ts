import { SEO_CITIES } from "@/lib/seo/data/cities.generated";
import type { SeoCity } from "@/lib/seo/types";

export { SEO_CITIES };

export function getSeoCities(): SeoCity[] {
  return SEO_CITIES;
}

export function getSeoCity(slug: string): SeoCity | undefined {
  return SEO_CITIES.find((city) => city.slug === slug);
}

export function cityPagePath(city: SeoCity): string {
  return `/cities/${city.slug}`;
}

export function featuredCities(limit = 24): SeoCity[] {
  return SEO_CITIES.slice(0, limit);
}

export function relatedCities(city: SeoCity, limit = 6): SeoCity[] {
  return SEO_CITIES.filter(
    (candidate) => candidate.slug !== city.slug && candidate.region === city.region
  ).slice(0, limit);
}

export function citiesByRegion(region: SeoCity["region"]): SeoCity[] {
  return SEO_CITIES.filter((city) => city.region === region);
}

export function cityOutdoorQuery(city: SeoCity, distanceKm = 50): string {
  const params = new URLSearchParams({
    lat: String(city.lat),
    lng: String(city.lng),
    distance: String(distanceKm),
  });
  return `/outdoor?${params.toString()}`;
}
