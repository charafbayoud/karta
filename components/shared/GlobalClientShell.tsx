import { Suspense } from "react";
import { AnalyticsScripts, CookieConsent } from "@/components/shared/CookieConsent";
import { AccountDeletedNotice } from "@/components/shared/AccountDeletedNotice";

export function GlobalClientShell() {
  return (
    <>
      <Suspense fallback={null}>
        <AccountDeletedNotice />
      </Suspense>
      <CookieConsent />
      <AnalyticsScripts />
    </>
  );
}
