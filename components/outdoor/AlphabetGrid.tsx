"use client";

import { getLetterStrokeSvgPolylines, GPS_ART_ALPHABET } from "@/lib/gps-art/alphabet";
import { GPS_ART_MAX_LETTERS } from "@/types/gps-art";

type AlphabetGridProps = {
  value: string;
  onChange: (text: string) => void;
};

export function AlphabetGrid({ value, onChange }: AlphabetGridProps) {
  const normalized = value.toUpperCase().replace(/[^A-Z]/g, "");

  function handleSelect(letter: string) {
    if (normalized.length >= GPS_ART_MAX_LETTERS) {
      onChange(`${normalized.slice(1)}${letter}`);
      return;
    }

    onChange(`${normalized}${letter}`);
  }

  return (
    <div className="alphabet-grid" role="group" aria-label="Alphabet letters">
      {GPS_ART_ALPHABET.map((letter) => {
        const isSelected = normalized.includes(letter);
        const polylines = getLetterStrokeSvgPolylines(letter);

        return (
          <button
            key={letter}
            type="button"
            className={`alphabet-option ${isSelected ? "is-selected" : ""}`}
            onClick={() => handleSelect(letter)}
            aria-label={`Add letter ${letter}`}
            aria-pressed={isSelected}
          >
            <svg viewBox="0 0 100 100" aria-hidden="true">
              {polylines.map((points, index) => (
                <polyline
                  key={index}
                  points={points}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ))}
            </svg>
            <span>{letter}</span>
          </button>
        );
      })}
    </div>
  );
}
