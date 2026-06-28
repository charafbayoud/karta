"use client";

import { useEffect, useState } from "react";
import type { LegalTocItem } from "@/lib/legal/markdown";

export function TableOfContents({ items }: { items: LegalTocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const nav = (
    <nav aria-label="Table of contents">
      <ul className="legal-toc-list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={activeId === item.id ? "is-active" : undefined}
              onClick={() => setMobileOpen(false)}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      <div className="legal-toc legal-toc--desktop">{nav}</div>
      <div className="legal-toc legal-toc--mobile">
        <button
          type="button"
          className="legal-toc-toggle"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          On this page
        </button>
        {mobileOpen ? <div className="legal-toc-panel">{nav}</div> : null}
      </div>
    </>
  );
}
