import { NOINDEX_METADATA } from "@/lib/seo/metadata";

export const metadata = NOINDEX_METADATA;

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
