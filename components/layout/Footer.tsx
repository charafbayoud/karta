import Link from "next/link";
import { signOut } from "@/lib/auth/actions";
import { getOptionalUser } from "@/lib/auth/require-user";

export async function Footer() {
  const user = await getOptionalUser();

  return (
    <footer className="v2-footer">
      <div className="v2-footer-inner">
        <div>
          <p className="v2-footer-brand">KARTA</p>
          <p className="v2-footer-domain">karta.club</p>
        </div>
        <nav className="v2-footer-links" aria-label="Footer">
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
              <Link href="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </footer>
  );
}
