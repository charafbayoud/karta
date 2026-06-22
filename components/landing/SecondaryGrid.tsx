import Link from "next/link";
import { LANDING_IMAGES } from "./images";
import { LandingMedia } from "./LandingMedia";
import { Reveal } from "./Reveal";

const CARDS = [
  {
    href: "/app",
    image: LANDING_IMAGES.grid.indoor,
    alt: "Group indoor cycling on home trainers",
    label: "Ride Indoor",
    title: "Zwift route finder",
    body: "Three taps. Matched route from 120+ worlds with distance and elevation estimates.",
    cta: "Start indoor quiz",
  },
  {
    href: "/outdoor",
    image: LANDING_IMAGES.grid.outdoor,
    alt: "Group of runners on a city street",
    label: "Ride Outdoor",
    title: "Smart loop generator",
    body: "Strava segments, real road routing, distance matched to your target every time.",
    cta: "Generate a loop",
  },
];

export function SecondaryGrid() {
  return (
    <section className="lp-section lp-products-section">
      <div className="lp-container">
        <Reveal>
          <div className="lp-grid-two">
            {CARDS.map((card) => (
              <Link key={card.href} href={card.href} className="lp-grid-card">
                <LandingMedia src={card.image} alt={card.alt} />
                <div className="lp-grid-card-overlay" aria-hidden="true" />
                <div className="lp-grid-card-content">
                  <span className="lp-chip">{card.label}</span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <span className="lp-grid-card-link">{card.cta} →</span>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
