import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service — KARTA",
  description: "Terms and conditions for using KARTA at karta.club.",
};

export default function TermsPage() {
  return <LegalLayout label="Legal" title="Terms of Service" document="terms.md" />;
}
