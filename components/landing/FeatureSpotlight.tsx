import Link from "next/link";
import { LANDING_IMAGES } from "./images";
import { LandingMedia } from "./LandingMedia";
import { Reveal } from "./Reveal";

export function FeatureSpotlight() {
  return (
    <section className="lp-section" id="spotlight">
      <div className="lp-container">
        <Reveal>
          <div className="lp-spotlight">
            <div className="lp-spotlight-copy">
              <p className="lp-label">Route intelligence</p>
              <h2>Your next ride, matched in seconds.</h2>
              <p>
                Answer three questions indoors — time, level, goal — and get a curated Zwift route.
                Outdoors, connect Strava and generate road-routed loops calibrated to your distance.
              </p>
              <Link href="/app" className="lp-btn">
                Try the route finder
              </Link>
            </div>

            <div className="lp-spotlight-visual">
              <LandingMedia
                src={LANDING_IMAGES.spotlight}
                alt="Three road cyclists riding into fog on a forest road"
              />
              <div className="lp-spotlight-ui">
                <p className="lp-label">Recommended</p>
                <p className="lp-spotlight-route">France Douce France</p>
                <p className="lp-spotlight-meta">23 km · ~55 min · Endurance</p>
              </div>
            </div>
          </div>
        </Reveal>

        <FeatureTrio />
      </div>
    </section>
  );
}

function FeatureTrio() {
  const items = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" strokeLinecap="round" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ),
      title: "Instant match",
      body: "120+ Zwift routes filtered by time, level, and training goal.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M4 18 L8 8 L12 12 L16 6 L20 14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Real roads",
      body: "Outdoor loops built from Strava segments — not straight lines over water.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M12 15V3M12 15 L8 11M12 15 L16 11" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 19h16" strokeLinecap="round" />
        </svg>
      ),
      title: "GPX export",
      body: "Download for Garmin, Wahoo, or upload straight to Strava.",
    },
  ];

  return (
    <Reveal className="lp-trio" delay={120}>
      {items.map((item) => (
        <article key={item.title} className="lp-trio-card">
          <span className="lp-icon-badge" aria-hidden="true">
            {item.icon}
          </span>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </Reveal>
  );
}
