"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  analyticsAllowed,
  COOKIE_CONSENT_KEY,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentValue,
} from "@/lib/cookies";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  function persist(value: CookieConsentValue) {
    writeCookieConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <div className="cookie-consent-inner">
        <p className="cookie-consent-copy">
          We use cookies to improve your experience and analyze usage. By continuing, you agree to
          our use of cookies. Read our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
        <div className="cookie-consent-actions">
          <button type="button" className="btn-secondary" onClick={() => persist("necessary")}>
            Necessary Only
          </button>
          <button type="button" className="btn-primary" onClick={() => persist("all")}>
            Accept All
          </button>
        </div>
        <button
          type="button"
          className="cookie-consent-dismiss"
          aria-label="Dismiss cookie banner"
          onClick={() => persist("necessary")}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function AnalyticsScripts() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    function sync() {
      setEnabled(analyticsAllowed(readCookieConsent()));
    }

    sync();
    window.addEventListener("karta:cookie-consent", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("karta:cookie-consent", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!enabled) return null;

  return null;
}
