import Link from "next/link";
import { LANDING_IMAGES } from "./images";
import { LandingMedia } from "./LandingMedia";

export function HeroSection() {
  return (
    <section className="lp-hero">
      <LandingMedia
        src={LANDING_IMAGES.hero}
        alt="Three road cyclists riding on a forest road at golden hour"
        priority
        wrapperClassName="lp-hero-media"
      />
      <div className="lp-hero-overlay" aria-hidden="true" />
      <div className="lp-hero-content">
        <p className="lp-chip lp-hero-chip">Indoor & outdoor cycling</p>
        <h1>The right route. Every ride.</h1>
        <p className="lp-hero-sub">
          Zwift routes in seconds. Real-world loops from Strava segments — distance matched,
          GPX ready.
        </p>
        <Link href="/signup" className="lp-btn">
          Start riding free
        </Link>
      </div>
    </section>
  );
}
