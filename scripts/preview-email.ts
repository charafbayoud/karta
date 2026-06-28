import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildKartaEmailHtml,
  DEFAULT_EMAIL_FEATURES,
} from "../lib/email/template";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.karta.club";
const outDir = join(process.cwd(), "preview", "emails");

const variants = [
  {
    filename: "waitlist.html",
    subject: "You're on the list — your next ride starts here",
    options: {
      appUrl,
      preheader:
        "Zwift routes in seconds. Outdoor loops from Strava. Your first ride is one tap away.",
      chip: "Waitlist confirmed",
      headline: "The right route. Every ride.",
      intro:
        "Thanks for joining the KARTA waitlist. We're building the fastest way to pick a Zwift route or outdoor loop — so you spend less time choosing and more time riding.",
      features: DEFAULT_EMAIL_FEATURES,
      cta: {
        label: "Start riding free",
        href: "/signup",
      },
      footerNote:
        "You're receiving this because you joined the KARTA waitlist at karta.club.",
    },
  },
  {
    filename: "signup.html",
    subject: "You're in — let's find your route",
    options: {
      appUrl,
      preheader:
        "Your KARTA account is ready. Find your next Zwift route or outdoor loop in seconds.",
      chip: "Welcome aboard",
      headline: "Your account is ready.",
      intro:
        "Welcome to KARTA — indoor Zwift routes and outdoor adventures, built for riders who want intentional rides without the endless scrolling.",
      features: DEFAULT_EMAIL_FEATURES,
      cta: {
        label: "Go to your dashboard",
        href: "/dashboard",
      },
    },
  },
] as const;

mkdirSync(outDir, { recursive: true });

for (const variant of variants) {
  const html = buildKartaEmailHtml(variant.options);
  const path = join(outDir, variant.filename);
  writeFileSync(path, html, "utf8");
  console.log(`✓ ${variant.subject}`);
  console.log(`  ${path}`);
}

console.log("\nOpen preview/emails/*.html in your browser.");
