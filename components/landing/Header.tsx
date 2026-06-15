import Link from "next/link";

export function Header() {
  return (
    <header className="landing-header">
      <div className="landing-header-inner">
        <Link href="/" className="landing-logo">
          KARTA
        </Link>
      </div>
    </header>
  );
}
