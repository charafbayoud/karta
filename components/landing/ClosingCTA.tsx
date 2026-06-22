import Link from "next/link";
import { LANDING_IMAGES } from "./images";
import { LandingMedia } from "./LandingMedia";
import { Reveal } from "./Reveal";

export function ClosingCTA() {
  return (
    <section className="lp-closing">
      <LandingMedia
        src={LANDING_IMAGES.closing}
        alt="Three road cyclists riding into fog on a forest road"
        wrapperClassName="lp-closing-media"
      />
      <div className="lp-closing-overlay" aria-hidden="true" />
      <div className="lp-closing-inner">
        <Reveal>
          <div className="lp-closing-content">
            <h2>Your next ride is one click away.</h2>
            <p>Free to try. Connect Strava only when you generate outdoor loops.</p>
            <Link href="/signup" className="lp-btn">
              Create free account
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
