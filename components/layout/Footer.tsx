import Link from "next/link";

export function Footer() {
  return (
    <footer className="v2-footer">
      <div className="v2-footer-inner">
        <div>
          <p className="v2-footer-brand">KARTA</p>
          <p className="v2-footer-domain">karta.club</p>
        </div>
        <nav className="v2-footer-links" aria-label="Footer">
          <Link href="/indoor">Indoor</Link>
          <Link href="/outdoor">Outdoor</Link>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign Up</Link>
        </nav>
      </div>
    </footer>
  );
}
