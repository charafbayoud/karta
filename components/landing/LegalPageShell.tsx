import Link from "next/link";
import { LandingFooter } from "./LandingFooter";
import { LandingNav } from "./LandingNav";

type LegalPageShellProps = {
  label: string;
  title: string;
  updated?: string;
  children: React.ReactNode;
};

export function LegalPageShell({ label, title, updated, children }: LegalPageShellProps) {
  return (
    <div className="lp">
      <LandingNav />
      <main id="main" className="lp-legal-page">
        <div className="lp-container">
          <nav className="lp-legal-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>{title}</span>
          </nav>

          <header className="lp-legal-head">
            <p className="lp-label">{label}</p>
            <h1>{title}</h1>
            {updated ? <p className="lp-legal-updated">Last updated {updated}</p> : null}
          </header>

          <article className="lp-legal-content">{children}</article>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
