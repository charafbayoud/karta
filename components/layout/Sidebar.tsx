import Link from "next/link";
import { signOut } from "@/lib/auth/actions";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/indoor", label: "Ride Indoor" },
  { href: "/outdoor", label: "Ride Outdoor" },
  { href: "/my-routes", label: "My Routes" },
  { href: "/dashboard", label: "Profile" },
  { href: "/dashboard", label: "Settings" },
];

export function Sidebar({ activePath }: { activePath: string }) {
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
            className={activePath.startsWith(item.href) ? "is-active" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <form action={signOut} className="dashboard-logout">
        <button type="submit">Logout</button>
      </form>
    </aside>
  );
}
