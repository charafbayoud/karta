import Link from "next/link";
import { LANDING_ROUTES } from "./landing-routes";
import { LandingRouteSchematic } from "./LandingRouteSchematic";
import { Reveal } from "./Reveal";

export function RoutePreview() {
  return (
    <section className="lp-section lp-routes-section" id="preview">
      <div className="lp-container">
        <Reveal>
          <header className="lp-routes-head">
            <p className="lp-label">Routes</p>
            <h2>Matched to your goal — schematic included.</h2>
            <p className="lp-routes-lead">
              Endurance, climbing, recovery, or Zwift pick — each route comes with a circuit map
              and elevation profile before you ride.
            </p>
          </header>
        </Reveal>

        <div className="lp-routes-grid" role="list">
          {LANDING_ROUTES.map((route, index) => (
            <Reveal key={route.id} delay={index * 80} className="lp-routes-grid-item">
              <article className="lp-route-card" role="listitem">
                <div className="lp-route-card-top">
                  <span className="lp-chip lp-route-card-chip">{route.label}</span>
                  <p className="lp-route-card-world">{route.world}</p>
                </div>

                <h3 className="lp-route-card-title">{route.title}</h3>

                <LandingRouteSchematic schema={route.schema} compact />

                <dl className="lp-route-card-stats">
                  <div>
                    <dt>Distance</dt>
                    <dd>{route.stats.distance}</dd>
                  </div>
                  <div>
                    <dt>Elevation</dt>
                    <dd>{route.stats.elevation}</dd>
                  </div>
                  <div>
                    <dt>Est. time</dt>
                    <dd>{route.stats.time}</dd>
                  </div>
                </dl>

                <Link href={route.href} className="lp-route-card-link">
                  Find route →
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
