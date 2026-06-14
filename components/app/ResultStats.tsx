import type { Difficulty } from "@/types/route";

interface ResultStatsProps {
  distanceKm: number;
  elevationM: number;
  estimatedMinutes: number;
  difficulty: Difficulty;
}

function StatIcon({ type }: { type: "time" | "distance" | "elevation" }) {
  if (type === "time") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 8 L8 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M8 8 L10.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "distance") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M2 12 L6 4 L10 8 L14 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2 12 L6 5 L9 8 L14 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const difficultyLabel: Record<Difficulty, string> = {
  easy: "Easy terrain",
  moderate: "Moderate effort",
  hard: "Hard climb",
  epic: "Epic challenge",
};

export function ResultStats({
  distanceKm,
  elevationM,
  estimatedMinutes,
  difficulty,
}: ResultStatsProps) {
  return (
    <div className="result-stats">
      <article className="result-stat-card result-stat-card-wide">
        <div className="result-stat-label">
          <StatIcon type="time" />
          <span>Estimated duration</span>
          <span className={`result-difficulty-pill result-difficulty-${difficulty}`}>
            {difficulty}
          </span>
        </div>
        <p className="result-stat-value">{estimatedMinutes} min</p>
        <p className="result-stat-desc">Fits your available riding window</p>
      </article>

      <article className="result-stat-card">
        <div className="result-stat-label">
          <StatIcon type="distance" />
          <span>Distance</span>
        </div>
        <p className="result-stat-value">{distanceKm} km</p>
        <p className="result-stat-desc">Total route length</p>
      </article>

      <article className="result-stat-card">
        <div className="result-stat-label">
          <StatIcon type="elevation" />
          <span>Elevation</span>
        </div>
        <p className="result-stat-value">{elevationM} m</p>
        <p className="result-stat-desc">{difficultyLabel[difficulty]}</p>
      </article>
    </div>
  );
}
