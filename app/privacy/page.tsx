import type { Metadata } from "next";
import { LegalPageShell } from "@/components/landing/LegalPageShell";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — KARTA",
  description: "How KARTA collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell label="Legal" title="Privacy Policy" updated="June 14, 2026">
      <p>
        KARTA (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates karta.club and related services
        for indoor Zwift route recommendations and outdoor loop generation. This policy explains
        what data we collect, why we collect it, and the choices you have.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Account data</strong> — email address, name, and password when you create an
          account. If you sign in with Google, we receive your profile information from that
          provider.
        </li>
        <li>
          <strong>Waitlist</strong> — email address if you join our early-access list on the
          landing page.
        </li>
        <li>
          <strong>Route preferences</strong> — quiz answers (time, level, goal) and saved routes
          when you use the app.
        </li>
        <li>
          <strong>Strava data</strong> — if you connect Strava, we access segments and routing
          data needed to generate outdoor loops. We store OAuth tokens securely to keep your
          connection active.
        </li>
        <li>
          <strong>Location</strong> — map pin or device location when you generate outdoor routes
          or use GPS Art features.
        </li>
        <li>
          <strong>Usage data</strong> — basic logs such as pages visited, feature usage, and error
          reports to keep the service reliable.
        </li>
      </ul>

      <h2>How we use your information</h2>
      <p>We use your data to:</p>
      <ul>
        <li>Provide route recommendations and generate GPX files</li>
        <li>Create and manage your account</li>
        <li>Save routes to My Routes</li>
        <li>Send transactional emails (welcome, account-related)</li>
        <li>Send product updates if you joined the waitlist or opted in</li>
        <li>Improve KARTA and fix bugs</li>
      </ul>
      <p>We do not sell your personal data.</p>

      <h2>Third-party services</h2>
      <p>KARTA relies on trusted providers to run the platform:</p>
      <ul>
        <li>
          <strong>Supabase</strong> — authentication and database hosting
        </li>
        <li>
          <strong>Strava</strong> — segment data and optional activity upload (only if you connect)
        </li>
        <li>
          <strong>Google Maps / Routes / Roads</strong> — mapping and road routing for outdoor
          features
        </li>
        <li>
          <strong>Resend</strong> — transactional email delivery
        </li>
      </ul>
      <p>
        Each provider processes data under their own privacy policies. We only share what is
        necessary to deliver the feature you use.
      </p>

      <h2>Cookies and local storage</h2>
      <p>
        We use essential cookies and local storage for login sessions, quiz state, and preferences.
        We do not use third-party advertising cookies.
      </p>

      <h2>Data retention</h2>
      <p>
        We keep your account data while your account is active. You can delete saved routes at any
        time. If you disconnect Strava, associated tokens are removed. Contact us to request
        account deletion.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, export, or delete
        your personal data, and to object to certain processing. Email us and we will respond
        within a reasonable timeframe.
      </p>

      <h2>Security</h2>
      <p>
        We use industry-standard measures including encrypted connections (HTTPS), secure token
        storage, and access controls. No method of transmission over the internet is 100% secure.
      </p>

      <h2>Children</h2>
      <p>
        KARTA is not directed at children under 16. We do not knowingly collect data from children.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this page from time to time. Material changes will be posted here with an
        updated date.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy? Email{" "}
        <a href="mailto:hello@karta.club">hello@karta.club</a> or visit our{" "}
        <Link href="/contact">Contact page</Link>.
      </p>
    </LegalPageShell>
  );
}
