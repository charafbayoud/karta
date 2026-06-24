import type { Metadata } from "next";
import { getAppUrl } from "@/lib/env";

const SITE_NAME = "KARTA";

export function seoMetadata(input: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = `${getAppUrl()}${input.path}`;

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: input.title,
      description: input.description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}

export const NOINDEX_METADATA: Metadata = {
  robots: { index: false, follow: false },
};

export function rootMetadata(): Metadata {
  const url = getAppUrl();

  return {
    metadataBase: new URL(url),
    title: {
      default: "KARTA — Indoor & Outdoor Cycling Platform",
      template: "%s | KARTA",
    },
    description:
      "KARTA helps cyclists ride smarter with Zwift route recommendations and outdoor loop generation.",
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: "KARTA — Indoor & Outdoor Cycling Platform",
      description:
        "Zwift route finder, training plans, and outdoor loop generation for cyclists and runners.",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: "KARTA — Indoor & Outdoor Cycling Platform",
      description:
        "Zwift route finder, training plans, and outdoor loop generation for cyclists and runners.",
    },
  };
}
