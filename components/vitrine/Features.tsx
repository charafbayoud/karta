const FEATURES = [
  {
    title: "Indoor intelligence",
    items: [
      "Instant Zwift route match",
      "Time, level, and goal aware",
      "120+ curated world routes",
      "Estimated duration per level",
    ],
  },
  {
    title: "Outdoor precision",
    items: [
      "Strava segment-powered loops",
      "Road-routed GPX (not straight lines)",
      "Multiple alternatives per generation",
      "Distance matched to your target",
    ],
  },
];

export function Features() {
  return (
    <section className="v2-section">
      <div className="v2-section-inner">
        <div className="section-head section-head--wide">
          <p className="karta-label">Features</p>
          <h2>Everything you need. Nothing you don&apos;t.</h2>
        </div>
        <div className="v2-features-grid">
          {FEATURES.map((group) => (
            <article key={group.title} className="v2-features-card mk-feature-card">
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
