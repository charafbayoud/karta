export function RouteDecoration() {
  return (
    <div className="hero-route-decoration" aria-hidden="true">
      <svg viewBox="0 0 800 120" preserveAspectRatio="none" className="h-full w-full">
        <path
          d="M 0 90 Q 200 30, 400 70 T 800 40"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1.5"
        />
        <path
          d="M 0 90 Q 200 30, 400 70 T 800 40"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          opacity="0.45"
        />
        <circle cx="640" cy="52" r="4" fill="var(--action)" opacity="0.7" />
      </svg>
    </div>
  );
}
