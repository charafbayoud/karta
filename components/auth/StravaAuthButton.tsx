type StravaAuthButtonProps = {
  mode: "signup" | "login";
  label?: string;
};

export function StravaAuthButton({
  mode,
  label = mode === "signup" ? "S'inscrire avec Strava" : "Continuer avec Strava",
}: StravaAuthButtonProps) {
  const href = mode === "signup" ? "/api/strava/signup" : "/api/strava/login";

  return (
    <a href={href} className="btn-secondary auth-oauth-btn auth-oauth-strava">
      {label}
    </a>
  );
}
