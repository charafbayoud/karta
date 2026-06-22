import Link from "next/link";
import { signOut } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="v2-navbar">
      <div className="v2-navbar-inner">
        <Link href="/" className="v2-logo">
          KARTA
        </Link>

        <nav className="v2-nav-links" aria-label="Main">
          {!user && (
            <>
              <Link href="/#preview">Routes</Link>
              <Link href="/#spotlight">Product</Link>
              <Link href="/#destinations">Destinations</Link>
            </>
          )}
          {user ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/app">Indoor</Link>
              <Link href="/outdoor">Outdoor</Link>
              <form action={signOut}>
                <button type="submit" className="v2-nav-button">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup" className="btn-primary v2-nav-cta">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
