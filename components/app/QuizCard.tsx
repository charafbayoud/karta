"use client";

interface QuizCardProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
}

export function QuizCard({ label, selected, onSelect, icon }: QuizCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`quiz-card ${selected ? "quiz-card-selected" : ""}`}
      aria-pressed={selected}
    >
      <span className="quiz-card-indicator" aria-hidden="true">
        {selected ? (
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="7" fill="var(--brand)" />
            <path
              d="M4 7 L6 9 L10 5"
              fill="none"
              stroke="#141414"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span className="quiz-card-indicator-empty" />
        )}
      </span>
      <span className="quiz-card-icon">{icon}</span>
      <span className="quiz-card-label">{label}</span>
    </button>
  );
}
