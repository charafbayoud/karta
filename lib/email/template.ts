export type KartaEmailFeature = {
  index: string;
  title: string;
  description: string;
};

export type KartaEmailOptions = {
  appUrl: string;
  preheader: string;
  chip: string;
  headline: string;
  intro: string;
  features: KartaEmailFeature[];
  cta: {
    label: string;
    href: string;
  };
  footerNote?: string;
};

const BRAND = {
  lime: "#C8F560",
  limeHover: "#B8E54A",
  text: "#141414",
  body: "#2A2A2E",
  muted: "#5C5C62",
  bg: "#F4F4F6",
  card: "#FFFFFF",
  border: "#E2E2E6",
  dark: "#0E0F0D",
} as const;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderFeatureRow(feature: KartaEmailFeature): string {
  return `
    <tr>
      <td style="padding:0 0 12px;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:${BRAND.bg};border:1px solid ${BRAND.border};border-radius:16px;">
          <tr>
            <td style="padding:18px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td width="44" valign="top" style="padding-right:14px;">
                    <div style="width:36px;height:36px;line-height:36px;border-radius:10px;background-color:${BRAND.text};color:${BRAND.lime};font-family:Courier,monospace;font-size:12px;font-weight:700;text-align:center;">
                      ${escapeHtml(feature.index)}
                    </div>
                  </td>
                  <td valign="top">
                    <p style="margin:0 0 4px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.35;font-weight:700;color:${BRAND.text};">
                      ${escapeHtml(feature.title)}
                    </p>
                    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;font-weight:400;color:${BRAND.muted};">
                      ${escapeHtml(feature.description)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `.trim();
}

export function buildKartaEmailHtml(options: KartaEmailOptions): string {
  const appUrl = options.appUrl.replace(/\/$/, "");
  const heroUrl = `${appUrl}/images/marketing/hero-cycling.png`;
  const logoUrl = `${appUrl}/icon.png`;
  const ctaHref = options.cta.href.startsWith("http")
    ? options.cta.href
    : `${appUrl}${options.cta.href.startsWith("/") ? "" : "/"}${options.cta.href}`;
  const footerNote =
    options.footerNote ??
    `You're receiving this because you signed up at <a href="${appUrl}" style="color:${BRAND.muted};text-decoration:underline;">karta.club</a>.`;

  const featureRows = options.features.map(renderFeatureRow).join("\n");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(options.headline)}</title>
  <!--[if mso]>
  <style>
    .karta-btn { border-radius: 999px !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">
    ${escapeHtml(options.preheader)}
  </div>
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:${BRAND.bg};padding:32px 16px 48px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;">
          <tr>
            <td align="center" style="padding:0 0 20px;">
              <a href="${appUrl}" style="text-decoration:none;display:inline-block;">
                <img src="${logoUrl}" width="40" height="40" alt="KARTA" style="display:block;border:0;border-radius:10px;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:0;background-color:${BRAND.card};border:1px solid ${BRAND.border};border-radius:24px;overflow:hidden;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:0;line-height:0;font-size:0;">
                    <img src="${heroUrl}" width="560" alt="Cyclists on a forest road" style="display:block;width:100%;max-width:560px;height:auto;border:0;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 28px 8px;">
                    <span style="display:inline-block;padding:6px 12px;border-radius:999px;background-color:${BRAND.lime};color:${BRAND.text};font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">
                      ${escapeHtml(options.chip)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 28px 0;">
                    <h1 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:30px;line-height:1.15;font-weight:700;letter-spacing:-0.02em;color:${BRAND.text};">
                      ${escapeHtml(options.headline)}
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 28px 0;">
                    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;font-weight:400;color:${BRAND.body};">
                      ${escapeHtml(options.intro)}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 28px 8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      ${featureRows}
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:8px 28px 32px;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="center" class="karta-btn" style="border-radius:999px;background-color:${BRAND.lime};">
                          <a href="${ctaHref}" style="display:inline-block;padding:14px 28px;border-radius:999px;background-color:${BRAND.lime};color:${BRAND.text};font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;letter-spacing:-0.01em;text-decoration:none;line-height:1.2;mso-padding-alt:0;">
                            <!--[if mso]><i style="letter-spacing:28px;mso-font-width:-100%;mso-text-raise:24pt">&nbsp;</i><![endif]-->
                            <span style="mso-text-raise:12pt;">${escapeHtml(options.cta.label)}</span>
                            <!--[if mso]><i style="letter-spacing:28px;mso-font-width:-100%">&nbsp;</i><![endif]-->
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:16px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.5;color:${BRAND.muted};">
                      Less scrolling through routes. More time on the bike.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 12px 0;">
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:${BRAND.muted};">
                ${footerNote}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export const DEFAULT_EMAIL_FEATURES: KartaEmailFeature[] = [
  {
    index: "01",
    title: "Indoor Zwift routes",
    description: "Get a smart route recommendation in seconds based on your time and goal.",
  },
  {
    index: "02",
    title: "Outdoor adventures",
    description: "Discover real-world loops from Strava segments — distance matched, GPX ready.",
  },
  {
    index: "03",
    title: "Built for your ride",
    description: "Recovery, endurance, climbing, or challenge — matched to your level every time.",
  },
];
