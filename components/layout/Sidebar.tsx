import Link from "next/link";
import { signOut } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/app", label: "Ride Indoor" },
  { href: "/outdoor", label: "Ride Outdoor" },
  { href: "/my-routes", label: "My Routes" },
  { href: "/settings", label: "Settings" },
];

function isNavActive(activePath: string, href: string) {
  if (href === "/app") {
    return activePath === "/app" || activePath.startsWith("/app/");
  }

  return activePath === href || activePath.startsWith(`${href}/`);
}

export async function Sidebar({ activePath }: { activePath: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <aside className="dashboard-sidebar">
      <Link href="/" className="v2-logo dashboard-logo">
        KARTA
      </Link>

      <nav className="dashboard-nav" aria-label="Dashboard">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={isNavActive(activePath, item.href) ? "is-active" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {user ? (
        <form action={signOut} className="dashboard-logout">
          <button type="submit">Logout</button>
        </form>
      ) : (
        <div className="dashboard-logout">
          <Link href="/login" className="btn-secondary">
            Login
          </Link>
        </div>
      )}
    </aside>
  );
}
