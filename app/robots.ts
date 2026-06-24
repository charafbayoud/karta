import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/sitemap-urls";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/my-routes",
        "/app",
        "/indoor",
        "/outdoor",
        "/login",
        "/signup",
        "/reset-password",
        "/setup",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
