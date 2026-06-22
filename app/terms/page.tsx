import type { Metadata } from "next";
import { LegalPageShell } from "@/components/landing/LegalPageShell";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — KARTA",
  description: "Terms and conditions for using KARTA at karta.club.",
};

export default function TermsPage() {
  return (
    <LegalPageShell label="Legal" title="Terms of Service" updated="June 14, 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your use of KARTA at karta.club and
        related applications. By creating an account or using the service, you agree to these
        Terms.
      </p>

      <h2>About KARTA</h2>
      <p>
        KARTA is a route recommendation platform for cyclists. We help you find Zwift routes
        indoors and generate real-world loops outdoors using Strava segments and road routing.
        KARTA is a planning tool — not a substitute for professional coaching, medical advice, or
        your own judgment on the road.
      </p>

      <h2>Eligibility</h2>
      <p>
        You must be at least 16 years old to use KARTA. You are responsible for ensuring that your
        use complies with local laws and with the terms of third-party platforms (Zwift, Strava,
        Garmin, Wahoo, etc.).
      </p>

      <h2>Your account</h2>
      <ul>
        <li>You must provide accurate information when signing up.</li>
        <li>Keep your login credentials confidential.</li>
        <li>You are responsible for activity under your account.</li>
        <li>Notify us promptly if you suspect unauthorized access.</li>
      </ul>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use KARTA for any unlawful purpose</li>
        <li>Attempt to reverse-engineer, scrape, or overload our systems</li>
        <li>Misrepresent generated routes as officially endorsed by Zwift or Strava</li>
        <li>Upload malicious content or interfere with other users</li>
        <li>Circumvent rate limits or access controls</li>
      </ul>

      <h2>Route recommendations &amp; safety</h2>
      <p>
        Routes and distances are estimates based on available data, algorithms, and third-party
        mapping. Elevation, duration, road conditions, traffic, weather, and local regulations may
        differ in reality.
      </p>
      <p>
        <strong>Always ride and run responsibly.</strong> Follow local traffic laws, use appropriate
        safety gear, and verify routes before you head out. KARTA is not liable for injuries,
        property damage, or losses resulting from your use of recommended or generated routes.
      </p>

      <h2>Third-party services</h2>
      <p>
        KARTA integrates with services such as Zwift, Strava, Google Maps, and device platforms.
        Your use of those services is subject to their own terms. We are not responsible for
        third-party outages, API changes, or data accuracy on external platforms.
      </p>

      <h2>Intellectual property</h2>
      <p>
        KARTA&apos;s brand, design, code, and content are owned by us or our licensors. You retain
        ownership of routes you create. You grant us a limited license to process your data solely
        to operate the service.
      </p>

      <h2>Free and paid features</h2>
      <p>
        Some features may be offered free during early access. We may introduce paid plans in the
        future with reasonable notice. Continued use after changes constitutes acceptance of updated
        pricing terms.
      </p>

      <h2>Disclaimer of warranties</h2>
      <p>
        KARTA is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any
        kind, express or implied, including fitness for a particular purpose or uninterrupted
        availability.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, KARTA and its operators shall not be liable for
        indirect, incidental, special, or consequential damages, or for any loss of data, profits,
        or goodwill arising from your use of the service.
      </p>

      <h2>Termination</h2>
      <p>
        You may stop using KARTA at any time. We may suspend or terminate access if you breach these
        Terms or if required for security or legal reasons.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these Terms. The &quot;Last updated&quot; date at the top will reflect changes.
        Material updates may also be communicated by email or in-app notice.
      </p>

      <h2>Governing law</h2>
      <p>
        These Terms are governed by applicable law in the jurisdiction where KARTA operates, without
        regard to conflict-of-law principles. If a provision is unenforceable, the remaining
        provisions remain in effect.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms? Email{" "}
        <a href="mailto:hello@karta.club">hello@karta.club</a> or visit our{" "}
        <Link href="/contact">Contact page</Link>.
      </p>
    </LegalPageShell>
  );
}
