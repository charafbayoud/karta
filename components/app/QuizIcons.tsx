export function IconTime({ minutes }: { minutes: number }) {
  const angle = Math.min(360, (minutes / 120) * 360);
  return (
    <svg viewBox="0 0 48 48" className="quiz-icon-svg" aria-hidden="true">
      <circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d={`M24 24 L24 10 A18 18 0 ${angle > 180 ? 1 : 0} 1 ${24 + 18 * Math.sin((angle * Math.PI) / 180)} ${24 - 18 * Math.cos((angle * Math.PI) / 180)} Z`}
        fill="currentColor"
        opacity="0.12"
      />
      <line x1="24" y1="24" x2="24" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line
        x1="24"
        y1="24"
        x2={24 + 8 * Math.sin((angle * Math.PI) / 180)}
        y2={24 - 8 * Math.cos((angle * Math.PI) / 180)}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconLevel({ bars }: { bars: number }) {
  return (
    <svg viewBox="0 0 48 48" className="quiz-icon-svg" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={10 + i * 9}
          y={34 - (i + 1) * 6}
          width="6"
          height={(i + 1) * 6}
          rx="1"
          fill={i < bars ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.2"
          opacity={i < bars ? 1 : 0.35}
        />
      ))}
    </svg>
  );
}

export function IconRecovery() {
  return (
    <svg viewBox="0 0 48 48" className="quiz-icon-svg" aria-hidden="true">
      <path
        d="M24 38 C16 30, 12 24, 12 18 C12 13, 16 10, 20 10 C22 10, 24 11, 24 13 C24 11, 26 10, 28 10 C32 10, 36 13, 36 18 C36 24, 32 30, 24 38 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconEndurance() {
  return (
    <svg viewBox="0 0 48 48" className="quiz-icon-svg" aria-hidden="true">
      <path
        d="M8 32 Q20 22, 32 28 T 44 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="32" r="3" fill="currentColor" />
    </svg>
  );
}

export function IconClimbing() {
  return (
    <svg viewBox="0 0 48 48" className="quiz-icon-svg" aria-hidden="true">
      <path
        d="M8 38 L20 14 L28 26 L40 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M36 8 L40 8 L40 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconChallenge() {
  return (
    <svg viewBox="0 0 48 48" className="quiz-icon-svg" aria-hidden="true">
      <path
        d="M24 8 L28 20 L40 20 L30 28 L34 40 L24 32 L14 40 L18 28 L8 20 L20 20 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSurprise() {
  return (
    <svg viewBox="0 0 48 48" className="quiz-icon-svg" aria-hidden="true">
      <rect x="10" y="10" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="18" r="2" fill="currentColor" />
      <circle cx="30" cy="18" r="2" fill="currentColor" />
      <circle cx="24" cy="24" r="2" fill="currentColor" />
      <circle cx="18" cy="30" r="2" fill="currentColor" />
      <circle cx="30" cy="30" r="2" fill="currentColor" />
    </svg>
  );
}
