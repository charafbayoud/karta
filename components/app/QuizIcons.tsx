import {
  IconPictogramCatCow,
  IconPictogramDownDog,
  IconPictogramForwardBend,
  IconPictogramHeadstand,
  IconPictogramTriangle,
} from "@/components/shared/PictogramIcons";

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
  return <IconPictogramForwardBend />;
}

export function IconEndurance() {
  return <IconPictogramDownDog />;
}

export function IconClimbing() {
  return <IconPictogramTriangle />;
}

export function IconChallenge() {
  return <IconPictogramHeadstand />;
}

export function IconSurprise() {
  return <IconPictogramCatCow />;
}
