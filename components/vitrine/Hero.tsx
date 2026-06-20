import Link from "next/link";

export function Hero() {
  return (
    <section className="v2-hero">
      <div className="v2-hero-inner">
        <p className="karta-label">karta.club</p>
        <h1>Stop choosing. Start riding.</h1>
        <p className="v2-hero-sub">
          The platform built for every cyclist — indoor and outdoor.
        </p>
        <div className="v2-hero-actions">
          <Link href="/indoor" className="btn-primary">
            Ride Indoor
          </Link>
          <Link href="/outdoor" className="btn-secondary">
            Ride Outdoor
          </Link>
        </div>
      </div>
    </section>
  );
}
