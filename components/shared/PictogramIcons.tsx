import type { ReactNode } from "react";

type PictogramProps = {
  className?: string;
};

const STROKE = {
  width: 3.5,
  cap: "round" as const,
  join: "round" as const,
};

function PictogramHead({ cx, cy, r = 3.5 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="currentColor" />;
}

function PictogramSvg({
  className,
  children,
}: PictogramProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

function PictogramBody({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.cap}
      strokeLinejoin={STROKE.join}
    />
  );
}

function PictogramWheel({ cx, cy }: { cx: number; cy: number }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={3.75}
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE.width}
      strokeLinecap={STROKE.cap}
    />
  );
}

/** Standing forward bend — recovery. */
export function IconPictogramForwardBend({ className = "quiz-icon-svg pictogram-icon" }: PictogramProps) {
  return (
    <PictogramSvg className={className}>
      <PictogramBody d="M16 38 L16 14 Q16 14 30 14 Q38 22 36 32" />
      <PictogramHead cx={38} cy={30} />
    </PictogramSvg>
  );
}

/** Downward dog — endurance. */
export function IconPictogramDownDog({ className = "quiz-icon-svg pictogram-icon" }: PictogramProps) {
  return (
    <PictogramSvg className={className}>
      <PictogramBody d="M8 30 Q16 30 22 12 Q26 10 26 12 Q30 30 38 30" />
      <PictogramHead cx={40} cy={30} />
    </PictogramSvg>
  );
}

/** Triangle pose — climbing. */
export function IconPictogramTriangle({ className = "quiz-icon-svg pictogram-icon" }: PictogramProps) {
  return (
    <PictogramSvg className={className}>
      <PictogramBody d="M36 18 L28 12 L12 38 L28 38" />
      <PictogramHead cx={36} cy={16} />
    </PictogramSvg>
  );
}

/** Scorpio headstand — challenge. */
export function IconPictogramHeadstand({ className = "quiz-icon-svg pictogram-icon" }: PictogramProps) {
  return (
    <PictogramSvg className={className}>
      <PictogramBody d="M14 36 Q10 32 14 28 Q18 24 22 22 Q28 14 34 12 Q40 10 40 18 Q40 24 36 26" />
      <PictogramHead cx={14} cy={36} />
    </PictogramSvg>
  );
}

/** Cat-cow wave — surprise. */
export function IconPictogramCatCow({ className = "quiz-icon-svg pictogram-icon" }: PictogramProps) {
  return (
    <PictogramSvg className={className}>
      <PictogramBody d="M6 28 Q10 20 14 24 Q18 28 22 24 Q26 20 30 24 Q34 28 38 24 Q42 20 42 26" />
      <PictogramHead cx={40} cy={18} />
    </PictogramSvg>
  );
}

/** Cycling — shoulderstand curve + wheels. */
export function IconPictogramCycling({ className = "outdoor-option-icon pictogram-icon" }: PictogramProps) {
  return (
    <PictogramSvg className={className}>
      <PictogramBody d="M28 12 L28 28 Q28 36 18 36 Q12 34 16 30" />
      <PictogramWheel cx={14} cy={34} />
      <PictogramWheel cx={34} cy={34} />
      <PictogramHead cx={20} cy={34} />
    </PictogramSvg>
  );
}

/** Running — dynamic stride. */
export function IconPictogramRunning({ className = "outdoor-option-icon pictogram-icon" }: PictogramProps) {
  return (
    <PictogramSvg className={className}>
      <PictogramBody d="M12 36 Q16 30 20 26 Q24 20 28 16 Q32 12 36 14" />
      <PictogramHead cx={36} cy={12} />
    </PictogramSvg>
  );
}

/** Walking — calm upright stride. */
export function IconPictogramWalking({ className = "outdoor-option-icon pictogram-icon" }: PictogramProps) {
  return (
    <PictogramSvg className={className}>
      <PictogramBody d="M18 36 Q20 28 22 24 Q24 22 26 24 Q28 26 28 36" />
      <PictogramHead cx={30} cy={14} />
    </PictogramSvg>
  );
}
