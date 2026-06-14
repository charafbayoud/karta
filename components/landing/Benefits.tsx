import { SectionLabel } from "./SectionLabel";

const benefits = [
  "Route recommendations in seconds",
  "Based on ride duration",
  "Adapted to your experience level",
  "Recovery, endurance, climbing or challenge rides",
  "Discover routes you would never have picked yourself",
];

export function Benefits() {
  return (
    <section className="landing-section">
      <div className="container-wide">
        <div className="landing-section-header">
          <SectionLabel>Why KARTA</SectionLabel>
          <h2 className="landing-section-title">Ride with intention</h2>
          <p className="landing-section-desc">
            Less scrolling through routes. More time on the bike.
          </p>
        </div>
        <ul className="landing-benefits-grid">
          {benefits.map((benefit, index) => (
            <li key={benefit} className="landing-benefit-card">
              <span className="font-data landing-benefit-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="landing-benefit-text">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
