import { Resend } from "resend";
import {
  buildKartaEmailHtml,
  DEFAULT_EMAIL_FEATURES,
} from "@/lib/email/template";
import { getAppUrl, isResendConfigured } from "@/lib/env";

let resendClient: Resend | null = null;

export function getResend(): Resend {
  if (resendClient) return resendClient;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable.");
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

export async function sendWelcomeEmail(
  email: string,
  appUrlOverride?: string
): Promise<"sent" | "skipped"> {
  if (!isResendConfigured()) {
    console.info(`[KARTA] Resend not configured — welcome email skipped for ${email}`);
    return "skipped";
  }

  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL ?? "KARTA <onboarding@resend.dev>";
  const appUrl = (appUrlOverride ?? getAppUrl()).replace(/\/$/, "");

  await resend.emails.send({
    from,
    to: email,
    subject: "You're on the list — your next ride starts here",
    html: buildKartaEmailHtml({
      appUrl,
      preheader: "Zwift routes in seconds. Outdoor loops from Strava. Your first ride is one tap away.",
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
    }),
  });

  return "sent";
}

export async function sendSignupWelcomeEmail(
  email: string,
  appUrlOverride?: string
): Promise<"sent" | "skipped"> {
  if (!isResendConfigured()) {
    console.info(`[KARTA] Resend not configured — signup email skipped for ${email}`);
    return "skipped";
  }

  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL ?? "KARTA <onboarding@resend.dev>";
  const appUrl = (appUrlOverride ?? getAppUrl()).replace(/\/$/, "");

  await resend.emails.send({
    from,
    to: email,
    subject: "You're in — let's find your route",
    html: buildKartaEmailHtml({
      appUrl,
      preheader: "Your KARTA account is ready. Find your next Zwift route or outdoor loop in seconds.",
      chip: "Welcome aboard",
      headline: "Your account is ready.",
      intro:
        "Welcome to KARTA — indoor Zwift routes and outdoor adventures, built for riders who want intentional rides without the endless scrolling.",
      features: DEFAULT_EMAIL_FEATURES,
      cta: {
        label: "Go to your dashboard",
        href: "/dashboard",
      },
    }),
  });

  return "sent";
}

export async function sendAccountDeletedEmail(
  email: string,
  appUrlOverride?: string
): Promise<"sent" | "skipped"> {
  if (!isResendConfigured()) {
    console.info(`[KARTA] Resend not configured — deletion email skipped for ${email}`);
    return "skipped";
  }

  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL ?? "KARTA <onboarding@resend.dev>";
  const appUrl = (appUrlOverride ?? getAppUrl()).replace(/\/$/, "");

  await resend.emails.send({
    from,
    to: email,
    subject: "Your KARTA account has been deleted",
    html: buildKartaEmailHtml({
      appUrl,
      preheader: "Your KARTA account and personal data have been permanently removed.",
      chip: "Account deleted",
      headline: "Your account has been deleted.",
      intro:
        "This confirms that your KARTA account, saved routes, and associated personal data have been permanently removed from our systems as requested.",
      features: DEFAULT_EMAIL_FEATURES,
      cta: {
        label: "Visit KARTA",
        href: "/",
      },
      footerNote: "You're receiving this because you requested account deletion at karta.club.",
    }),
  });

  return "sent";
}
