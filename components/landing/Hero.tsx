import { EmailForm } from "./EmailForm";
import { RouteDecoration } from "./RouteDecoration";
import { SectionLabel } from "./SectionLabel";

export function Hero() {
  return (
    <section className="landing-hero">
      <div className="container-narrow landing-hero-content">
        <SectionLabel>Early access</SectionLabel>
        <h1 className="landing-hero-title">
          Stop choosing.
          <br />
          <span className="landing-hero-accent">Start riding.</span>
        </h1>
        <p className="landing-hero-subtitle">
          KARTA finds the perfect Zwift route for your next ride based on your
          available time, experience level and training goal.
        </p>

        <div className="landing-hero-form">
          <EmailForm variant="hero" />
        </div>

        <p className="landing-social-proof">
          <span className="landing-social-dot" aria-hidden="true" />
          Join 47 riders already on the waitlist
        </p>
      </div>
      <RouteDecoration />
    </section>
  );
}
