"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 48);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`lp-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="lp-container lp-nav-inner">
        <Link href="/" className="lp-logo">
          KARTA
        </Link>

        <nav className="lp-nav-links" aria-label="Main">
          <a href="#preview">Routes</a>
          <a href="#spotlight">Product</a>
          <a href="#destinations">Destinations</a>
        </nav>

        <div className="lp-nav-actions">
          <Link href="/login" className="lp-nav-login">
            Log in
          </Link>
          <Link href="/signup" className="lp-btn lp-nav-cta">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
