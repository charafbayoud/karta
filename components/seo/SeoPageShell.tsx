import Link from "next/link";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { getOptionalUser } from "@/lib/auth/require-user";

export async function SeoPageShell({
  children,
  breadcrumbs,
}: {
  children: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}) {
  const user = await getOptionalUser();

  return (
    <div className="lp seo-page">
      <LandingNav isAuthenticated={Boolean(user)} variant="solid" />
      <main id="main" className="seo-main">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="seo-breadcrumbs" aria-label="Breadcrumb">
            <ol>
              {breadcrumbs.map((crumb, index) => (
                <li key={`${crumb.label}-${index}`}>
                  {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span>{crumb.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {children}
      </main>
      <LandingFooter isAuthenticated={Boolean(user)} />
    </div>
  );
}
