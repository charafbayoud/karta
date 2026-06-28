import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — KARTA",
  description: "How KARTA collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return <LegalLayout label="Legal" title="Privacy Policy" document="privacy.md" />;
}
