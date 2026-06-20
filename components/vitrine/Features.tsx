const FEATURES = [
  {
    title: "Indoor",
    items: [
      "Instant Zwift route recommendation",
      "Matched to your time and level",
      "Recovery, endurance, climbing, challenge",
      "Export GPX for Zwift",
    ],
  },
  {
    title: "Outdoor",
    items: [
      "GPS Art with letters A–Z and emojis",
      "Smart loop generator",
      "Strava segment integration",
      "GPX export for Garmin and Wahoo",
    ],
  },
];

export function Features() {
  return (
    <section className="v2-section v2-section-muted">
      <div className="v2-section-inner">
        <p className="karta-label">Features</p>
        <h2>Built for every ride</h2>
        <div className="v2-features-grid">
          {FEATURES.map((group) => (
            <article key={group.title} className="v2-features-card">
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
