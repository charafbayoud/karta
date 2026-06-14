"use client";

interface QuizSidebarProps {
  currentStep: 1 | 2 | 3;
  completedThrough?: number;
}

const steps = [
  { number: 1, label: "Time" },
  { number: 2, label: "Level" },
  { number: 3, label: "Goal" },
];

export function QuizSidebar({ currentStep, completedThrough }: QuizSidebarProps) {
  const completed = completedThrough ?? currentStep - 1;

  return (
    <aside className="quiz-sidebar" aria-label="Quiz progress">
      <ol className="quiz-sidebar-steps">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isComplete = step.number <= completed;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.number} className="quiz-sidebar-step">
              <div className="quiz-sidebar-step-inner">
                <span
                  className={`quiz-sidebar-dot ${isActive ? "quiz-sidebar-dot-active" : ""} ${isComplete && !isActive ? "quiz-sidebar-dot-complete" : ""}`}
                >
                  {isComplete && !isActive ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                      <path
                        d="M2 6 L5 9 L10 3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </span>
                {!isLast && (
                  <span
                    className={`quiz-sidebar-line ${isComplete ? "quiz-sidebar-line-complete" : ""}`}
                    aria-hidden="true"
                  />
                )}
              </div>
              <span
                className={`quiz-sidebar-label ${isActive ? "quiz-sidebar-label-active" : ""}`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
