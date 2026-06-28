"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "@/lib/auth/actions";

type LandingNavProps = {
  isAuthenticated?: boolean;
  /** overlay = transparent over homepage hero; solid = readable bar on light pages */
  variant?: "overlay" | "solid";
};

export function LandingNav({ isAuthenticated = false, variant = "solid" }: LandingNavProps) {
  const [scrolled, setScrolled] = useState(variant === "solid");

  useEffect(() => {
    if (variant === "solid") {
      setScrolled(true);
      return;
    }

    function onScroll() {
      setScrolled(window.scrollY > 48);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const navClassName = [
    "lp-nav",
    variant === "overlay" ? "lp-nav--overlay" : "lp-nav--solid",
    scrolled ? "is-scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={navClassName}>
      <div className="lp-container lp-nav-inner">
        <Link href="/" className="lp-logo">
          KARTA
        </Link>

        <nav className="lp-nav-links" aria-label="Main">
          <Link href="/#preview">Routes</Link>
          <Link href="/#spotlight">Product</Link>
          <Link href="/#destinations">Destinations</Link>
        </nav>

        <div className="lp-nav-actions">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="lp-nav-login">
                Dashboard
              </Link>
              <form action={signOut}>
                <button type="submit" className="lp-btn lp-nav-cta">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="lp-nav-login">
                Log in
              </Link>
              <Link href="/signup" className="lp-btn lp-nav-cta">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
