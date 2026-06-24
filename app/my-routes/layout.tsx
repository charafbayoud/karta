import type { Metadata } from "next";
import { NOINDEX_METADATA } from "@/lib/seo/metadata";

export const metadata: Metadata = NOINDEX_METADATA;

export default function MyRoutesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
