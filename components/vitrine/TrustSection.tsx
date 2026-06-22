const TRUST_ITEMS = [
  {
    title: "Export anywhere",
    body: "GPX files work with Garmin, Wahoo, Hammerhead, and Strava upload.",
  },
  {
    title: "Strava-native outdoor",
    body: "Segments come from your connected account — popular climbs and loops near your pin.",
  },
  {
    title: "Honest distances",
    body: "Outdoor loops are routed on roads and calibrated to your selected distance — not straight lines over water.",
  },
  {
    title: "Your data, your routes",
    body: "Save favourites to My Routes. Delete anytime. No lock-in.",
  },
];

export function TrustSection() {
  return (
    <section className="v2-section v2-section-muted">
      <div className="v2-section-inner">
        <div className="section-head section-head--wide">
          <p className="karta-label">Trust</p>
          <h2>Built for serious riders</h2>
        </div>
        <div className="mk-trust-grid">
          {TRUST_ITEMS.map((item) => (
            <article key={item.title} className="mk-trust-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
