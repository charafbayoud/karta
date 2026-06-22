import { LANDING_IMAGES } from "./images";
import { LandingMedia } from "./LandingMedia";
import { Reveal } from "./Reveal";

const REGIONS = [
  {
    name: "Paris",
    rides: "840+ segments",
    image: LANDING_IMAGES.regions.paris,
    alt: "Group of cyclists on a road near Paris",
  },
  {
    name: "London",
    rides: "620+ segments",
    image: LANDING_IMAGES.regions.london,
    alt: "Group of runners on a London street",
  },
  {
    name: "Barcelona",
    rides: "510+ segments",
    image: LANDING_IMAGES.regions.barcelona,
    alt: "Group of cyclists on a scenic road",
  },
  {
    name: "Amsterdam",
    rides: "390+ segments",
    image: LANDING_IMAGES.regions.amsterdam,
    alt: "Group of cyclists riding together",
  },
];

export function DestinationsSection() {
  return (
    <section className="lp-section" id="destinations">
      <div className="lp-container">
        <Reveal>
          <div className="lp-destinations-head">
            <p className="lp-label">Global coverage</p>
            <h2>Ride and run anywhere Strava goes.</h2>
            <p>
              Drop a pin in any city. KARTA pulls local segments and builds loops on real roads
              near you — for cycling groups and running crews alike.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="lp-destinations-grid">
            {REGIONS.map((region) => (
              <article key={region.name} className="lp-dest-card">
                <LandingMedia src={region.image} alt={region.alt} />
                <div className="lp-dest-card-overlay" aria-hidden="true" />
                <span className="lp-dest-pin" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                  </svg>
                </span>
                <div className="lp-dest-card-body">
                  <h3>{region.name}</h3>
                  <p>{region.rides}</p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
