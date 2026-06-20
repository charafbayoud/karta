import { Resend } from "resend";
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
    subject: "Ton premier parcours Karta t'attend.",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background-color:#FAFAF7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAF7;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#EDEAE3;border-radius:12px;padding:40px 32px;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <p style="margin:0;font-family:Georgia,serif;font-size:28px;color:#1A1A1A;font-weight:500;">KARTA</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:16px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#2C2C2C;font-weight:300;">
                Bienvenue sur la liste d'attente. Ta prochaine sortie Zwift mérite d'être choisie avec intention — pas au hasard.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#6B6860;font-weight:300;">
                KARTA te trouve le parcours parfait selon ton temps, ton niveau et ton objectif du jour. Pédale. On s'occupe du reste.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center">
              <a href="${appUrl}/app" style="display:inline-block;background-color:#C4622D;color:#FAFAF7;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:500;">
                Trouver mon parcours
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
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
    subject: "You're in 🚴",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background-color:#FAFAF7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAF7;padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#EDEAE3;border-radius:12px;padding:40px 32px;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <p style="margin:0;font-family:Georgia,serif;font-size:28px;color:#1A1A1A;font-weight:500;">KARTA</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#2C2C2C;font-weight:300;">
                Welcome to KARTA — indoor Zwift routes and outdoor adventures, built for riders who want to spend less time choosing and more time riding.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center">
              <a href="${appUrl}/dashboard" style="display:inline-block;background-color:#C4622D;color:#FAFAF7;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:500;">
                Go to your dashboard
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });

  return "sent";
}
