import Link from "next/link";

export function Header() {
  return (
    <header className="landing-header">
      <div className="landing-header-inner">
        <Link href="/" className="landing-logo">
          KARTA
        </Link>
        <Link href="/app" className="landing-dev-link">
          Open App
        </Link>
      </div>
    </header>
  );
}
