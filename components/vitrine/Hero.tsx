import Link from "next/link";
import { HeroPreview } from "@/components/vitrine/previews/HeroPreview";

export function Hero() {
  return (
    <section className="mk-hero">
      <div className="mk-hero-grid">
        <div className="mk-hero-copy section-head section-head--flush">
          <p className="karta-label">Indoor & outdoor cycling</p>
          <h1>
            The right route.
            <br />
            <span className="mk-hero-accent">Every ride.</span>
          </h1>
          <p className="mk-hero-lead">
            KARTA recommends Zwift routes in seconds and generates real-world loops from Strava
            segments near you — calibrated to your distance, exported as GPX.
          </p>
          <div className="btn-group">
            <Link href="/app" className="btn-primary">
              Start indoor
            </Link>
            <Link href="/outdoor" className="btn-secondary">
              Generate a loop
            </Link>
          </div>
          <p className="mk-hero-note">No onboarding. Pick a mode and ride.</p>
        </div>
        <HeroPreview />
      </div>
    </section>
  );
}
