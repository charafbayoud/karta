"use client";

interface ProgressBarProps {
  currentStep: 1 | 2 | 3;
}

const steps = ["Your ride", "Finding route", "Your route"];

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between gap-2">
        {steps.map((label, index) => {
          const stepNumber = (index + 1) as 1 | 2 | 3;
          const isActive = stepNumber === currentStep;
          const isComplete = stepNumber < currentStep;

          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: isActive || isComplete ? "var(--action)" : "var(--bg-card)",
                  color: isActive || isComplete ? "var(--action-text)" : "var(--text-disabled)",
                  border: `1px solid ${isActive || isComplete ? "var(--action)" : "var(--border)"}`,
                }}
              >
                {stepNumber}
              </div>
              <span
                className="hidden text-xs sm:block"
                style={{
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div
        className="mt-4 h-1 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / 2) * 100}%`,
            backgroundColor: "var(--accent)",
          }}
        />
      </div>
    </div>
  );
}
