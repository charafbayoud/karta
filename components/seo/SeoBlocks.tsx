import Link from "next/link";

export function SeoHero({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <header className="seo-hero">
      <p className="karta-label">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="seo-lead">{description}</p>
      <div className="seo-cta-row">
        <Link href={primaryHref} className="btn-primary">
          {primaryLabel}
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link href={secondaryHref} className="btn-secondary">
            {secondaryLabel}
          </Link>
        )}
      </div>
    </header>
  );
}

export function SeoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="seo-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function SeoCopy({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="seo-copy">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </div>
  );
}

export function SeoLinkGrid({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string; meta?: string }>;
}) {
  return (
    <section className="seo-section">
      <h2>{title}</h2>
      <ul className="seo-link-grid">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>
              <strong>{link.label}</strong>
              {link.meta && <span>{link.meta}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SeoFaq({
  title,
  items,
}: {
  title: string;
  items: Array<{ question: string; answer: string }>;
}) {
  return (
    <section className="seo-section">
      <h2>{title}</h2>
      <dl className="seo-faq">
        {items.map((item) => (
          <div key={item.question}>
            <dt>{item.question}</dt>
            <dd>{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
