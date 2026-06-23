type StravaAuthButtonProps = {
  mode: "signup" | "login";
  label?: string;
  returnTo?: string;
  className?: string;
};

export function StravaAuthButton({
  mode,
  label = mode === "signup" ? "S'inscrire avec Strava" : "Continuer avec Strava",
  returnTo,
  className = "btn-primary auth-submit auth-oauth-strava",
}: StravaAuthButtonProps) {
  const base = mode === "signup" ? "/api/strava/signup" : "/api/strava/login";
  const href =
    returnTo && returnTo.startsWith("/")
      ? `${base}?returnTo=${encodeURIComponent(returnTo)}`
      : base;

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}
