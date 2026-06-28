export const COOKIE_CONSENT_KEY = "karta_cookie_consent";

export type CookieConsentValue = "all" | "necessary";

export function readCookieConsent(): CookieConsentValue | null {
  if (typeof window === "undefined") return null;

  const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  if (value === "all" || value === "necessary") {
    return value;
  }

  return null;
}

export function writeCookieConsent(value: CookieConsentValue): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  window.dispatchEvent(new Event("karta:cookie-consent"));
}

export function analyticsAllowed(consent: CookieConsentValue | null): boolean {
  return consent === "all";
}
