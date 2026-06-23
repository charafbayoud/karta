import Link from "next/link";
import { StravaAuthButton } from "./StravaAuthButton";

export function LoginForm({ nextPath }: { nextPath: string }) {
  return (
    <div className="auth-card">
      <p className="karta-label">Bon retour</p>
      <h1>Connexion</h1>
      <p className="auth-sub">Connecte-toi avec ton compte Strava.</p>

      <StravaAuthButton mode="login" returnTo={nextPath} />

      <p className="auth-switch">
        Pas encore de compte ? <Link href="/signup">S&apos;inscrire</Link>
      </p>
    </div>
  );
}
