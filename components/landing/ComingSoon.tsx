import { SectionLabel } from "./SectionLabel";

const features = [
  "Weekly route suggestions by email",
  "Ride history",
  "Route achievements",
  "Personal recommendations",
];

export function ComingSoon() {
  return (
    <section className="landing-section">
      <div className="container-narrow">
        <div className="landing-section-header">
          <SectionLabel>Roadmap</SectionLabel>
          <h2 className="landing-section-title">Coming soon</h2>
          <p className="landing-section-desc">
            We&apos;re building more ways to help you ride smarter.
          </p>
        </div>
        <ul className="landing-roadmap">
          {features.map((feature) => (
            <li key={feature} className="landing-roadmap-item">
              <span>{feature}</span>
              <span className="landing-roadmap-badge">Soon</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
