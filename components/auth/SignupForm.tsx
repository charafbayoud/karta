import Link from "next/link";
import { StravaAuthButton } from "./StravaAuthButton";

export function SignupForm() {
  return (
    <div className="auth-card">
      <p className="karta-label">Rejoindre KARTA</p>
      <h1>Inscription</h1>
      <p className="auth-sub">Crée ton compte en un clic avec Strava.</p>

      <StravaAuthButton mode="signup" />

      <p className="auth-switch">
        Déjà un compte ? <Link href="/login">Se connecter</Link>
      </p>
    </div>
  );
}
