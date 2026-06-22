"use client";

import type { OutdoorSport } from "@/types/gps-art";
import {
  IconPictogramCycling,
  IconPictogramRunning,
  IconPictogramWalking,
} from "@/components/shared/PictogramIcons";

const OPTIONS: { value: OutdoorSport; label: string }[] = [
  { value: "cycling", label: "Cycling" },
  { value: "running", label: "Running" },
  { value: "walking", label: "Walking" },
];

function SportIcon({ sport }: { sport: OutdoorSport }) {
  if (sport === "cycling") return <IconPictogramCycling />;
  if (sport === "running") return <IconPictogramRunning />;
  return <IconPictogramWalking />;
}

export function SportSelector({
  value,
  onChange,
}: {
  value: OutdoorSport;
  onChange: (sport: OutdoorSport) => void;
}) {
  return (
    <div className="outdoor-option-grid" role="group" aria-label="Sport">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`outdoor-option ${value === option.value ? "is-selected" : ""}`}
          onClick={() => onChange(option.value)}
        >
          <SportIcon sport={option.value} />
          {option.label}
        </button>
      ))}
    </div>
  );
}
