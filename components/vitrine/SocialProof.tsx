import { getRiderCount } from "@/lib/auth/profile";

export async function SocialProof() {
  const count = await getRiderCount();
  const riderLabel =
    count === null ? "Riders on KARTA" : `${count.toLocaleString("en-US")}+ riders`;

  return (
    <section className="mk-social">
      <div className="mk-social-inner">
        <div className="mk-social-stat">
          <p className="mk-social-value font-data">{riderLabel}</p>
          <p className="mk-social-label">Already planning smarter rides</p>
        </div>
        <div className="mk-social-divider" aria-hidden="true" />
        <div className="mk-social-logos">
          <span>Zwift</span>
          <span>Strava</span>
          <span>Garmin</span>
          <span>Wahoo</span>
        </div>
      </div>
    </section>
  );
}
