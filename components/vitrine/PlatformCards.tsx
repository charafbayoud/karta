import Link from "next/link";

const CARDS = [
  {
    icon: "🖥️",
    title: "Ride Indoor",
    description:
      "Find your perfect Zwift route in 2 clicks. Time, level, goal — KARTA does the rest.",
    href: "/indoor",
    cta: "Start Indoor",
  },
  {
    icon: "🗺️",
    title: "Ride Outdoor",
    description:
      "Generate real GPS routes or create GPS Art with your name, a word or an emoji.",
    href: "/outdoor",
    cta: "Start Outdoor",
  },
];

export function PlatformCards() {
  return (
    <section className="v2-section">
      <div className="v2-section-inner">
        <p className="karta-label">Platform</p>
        <h2>Two ways to ride</h2>
        <div className="v2-platform-grid">
          {CARDS.map((card) => (
            <article key={card.title} className="v2-platform-card">
              <span className="v2-platform-icon" aria-hidden>
                {card.icon}
              </span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link href={card.href} className="link-accent">
                {card.cta} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
