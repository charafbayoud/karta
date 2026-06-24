import type { MetadataRoute } from "next";
import { absoluteUrl, getAllPublicSeoPaths } from "@/lib/seo/sitemap-urls";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return getAllPublicSeoPaths().map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/zwift") || path.startsWith("/cities") ? 0.8 : 0.7,
  }));
}
