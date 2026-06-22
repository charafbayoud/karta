import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="mk-cta">
      <div className="mk-cta-inner section-head section-head--center section-head--flush">
        <p className="karta-label">Get started</p>
        <h2>Your next ride is one click away.</h2>
        <p className="mk-cta-sub">
          Free to try. Connect Strava only when you generate outdoor loops.
        </p>
        <div className="btn-group btn-group--center">
          <Link href="/signup" className="btn-primary">
            Create account
          </Link>
          <Link href="/app" className="btn-secondary">
            Try indoor quiz
          </Link>
        </div>
      </div>
    </section>
  );
}
