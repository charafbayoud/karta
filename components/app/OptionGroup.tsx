"use client";

interface OptionGroupProps<T extends string | number> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function OptionGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: OptionGroupProps<T>) {
  return (
    <fieldset className="mb-8">
      <legend
        className="mb-4 block text-sm font-medium uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </legend>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className="rounded-lg px-4 py-3 text-sm transition-all"
              style={{
                backgroundColor: selected ? "var(--action)" : "var(--bg-card)",
                color: selected ? "var(--action-text)" : "var(--text-body)",
                border: `1px solid ${selected ? "var(--action)" : "var(--border)"}`,
                fontWeight: selected ? 500 : 300,
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
