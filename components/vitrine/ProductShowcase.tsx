import Link from "next/link";

const PRODUCTS = [
  {
    id: "indoor",
    label: "Ride Indoor",
    title: "Your next Zwift route, matched in 2 clicks",
    body: "Answer three questions — available time, experience, training goal — and get a curated route from 120+ worlds with distance, elevation, and duration estimates.",
    href: "/app",
    cta: "Open indoor quiz",
    image: "/images/marketing/indoor.svg",
    stats: ["120+ routes", "GPX for Zwift", "Instant match"],
  },
  {
    id: "outdoor",
    label: "Ride Outdoor",
    title: "Smart loops on real roads, not crow flies",
    body: "Connect Strava, set your distance, pick a start point. KARTA builds rideable loops from local segments — with alternatives every time you regenerate.",
    href: "/outdoor",
    cta: "Generate a loop",
    image: "/images/marketing/outdoor.svg",
    stats: ["Strava segments", "Google Routes", "GPX export"],
  },
];

export function ProductShowcase() {
  return (
    <section className="v2-section" id="products">
      <div className="v2-section-inner">
        <div className="section-head section-head--wide">
          <p className="karta-label">Platform</p>
          <h2>Two modes. One calm experience.</h2>
        </div>
        <div className="mk-product-stack">
          {PRODUCTS.map((product, index) => (
            <article
              key={product.id}
              className={`mk-product-block ${index % 2 === 1 ? "mk-product-block--reverse" : ""}`}
            >
              <div className="mk-product-copy">
                <p className="karta-label">{product.label}</p>
                <h3>{product.title}</h3>
                <p className="mk-product-body">{product.body}</p>
                <ul className="mk-product-stats">
                  {product.stats.map((stat) => (
                    <li key={stat}>{stat}</li>
                  ))}
                </ul>
                <Link href={product.href} className="link-accent mk-product-link">
                  {product.cta} →
                </Link>
              </div>
              <div className="mk-product-visual">
                <img
                  src={product.image}
                  alt=""
                  width={560}
                  height={360}
                  className="mk-product-image"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
