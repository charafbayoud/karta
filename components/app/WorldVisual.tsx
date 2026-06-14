interface WorldVisualProps {
  world: string;
}

function WatopiaVisual() {
  return (
    <svg viewBox="0 0 800 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="watopia-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-light)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <rect width="800" height="200" fill="url(#watopia-sky)" />
      <ellipse cx="650" cy="60" rx="80" ry="30" fill="var(--action)" opacity="0.3" />
      <path d="M 0 160 Q 200 120, 400 150 T 800 130 L 800 200 L 0 200 Z" fill="var(--accent-dark)" opacity="0.4" />
      <path d="M 100 140 L 130 80 L 160 140 Z" fill="var(--text-primary)" opacity="0.15" />
      <circle cx="700" cy="50" r="25" fill="var(--bg-primary)" opacity="0.5" />
      <path d="M 50 170 Q 300 130, 550 160" fill="none" stroke="var(--text-primary)" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

function LondonVisual() {
  return (
    <svg viewBox="0 0 800 200" className="h-full w-full" aria-hidden="true">
      <rect width="800" height="200" fill="var(--bg-hover)" />
      <rect x="60" y="80" width="30" height="80" fill="var(--text-muted)" opacity="0.5" />
      <rect x="120" y="60" width="25" height="100" fill="var(--text-muted)" opacity="0.4" />
      <rect x="200" y="40" width="20" height="120" fill="var(--text-primary)" opacity="0.2" />
      <rect x="350" y="70" width="40" height="90" fill="var(--text-muted)" opacity="0.5" />
      <rect x="500" y="50" width="35" height="110" fill="var(--text-primary)" opacity="0.15" />
      <rect x="620" y="75" width="28" height="85" fill="var(--text-muted)" opacity="0.4" />
      <path d="M 0 160 L 800 160" stroke="var(--text-primary)" strokeWidth="3" opacity="0.2" />
      <circle cx="400" cy="155" r="8" fill="var(--action)" />
    </svg>
  );
}

function NewYorkVisual() {
  return (
    <svg viewBox="0 0 800 200" className="h-full w-full" aria-hidden="true">
      <rect width="800" height="200" fill="var(--border)" />
      <rect x="100" y="30" width="40" height="130" fill="var(--text-body)" opacity="0.3" />
      <rect x="180" y="50" width="35" height="110" fill="var(--text-body)" opacity="0.25" />
      <rect x="280" y="20" width="50" height="140" fill="var(--text-primary)" opacity="0.2" />
      <rect x="400" y="45" width="30" height="115" fill="var(--text-body)" opacity="0.3" />
      <rect x="520" y="35" width="45" height="125" fill="var(--text-primary)" opacity="0.15" />
      <rect x="650" y="55" width="38" height="105" fill="var(--text-body)" opacity="0.25" />
      <path d="M 0 165 L 800 165" stroke="var(--action)" strokeWidth="2" opacity="0.4" />
    </svg>
  );
}

function InnsbruckVisual() {
  return (
    <svg viewBox="0 0 800 200" className="h-full w-full" aria-hidden="true">
      <rect width="800" height="200" fill="var(--accent-light)" opacity="0.3" />
      <path d="M 0 180 L 150 60 L 300 180 Z" fill="var(--accent-dark)" opacity="0.5" />
      <path d="M 200 180 L 400 30 L 600 180 Z" fill="var(--accent)" opacity="0.4" />
      <path d="M 500 180 L 650 80 L 800 180 Z" fill="var(--accent-dark)" opacity="0.35" />
      <path d="M 0 170 Q 400 140, 800 170" fill="none" stroke="var(--text-primary)" strokeWidth="2" opacity="0.2" />
    </svg>
  );
}

function YorkshireVisual() {
  return (
    <svg viewBox="0 0 800 200" className="h-full w-full" aria-hidden="true">
      <rect width="800" height="200" fill="var(--bg-card)" />
      <path d="M 0 150 Q 100 120, 200 145 T 400 130 T 600 140 T 800 125 L 800 200 L 0 200 Z" fill="var(--accent-light)" opacity="0.4" />
      <path d="M 0 165 Q 150 140, 300 160 T 600 150 T 800 140" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.5" />
      <ellipse cx="650" cy="50" rx="60" ry="20" fill="var(--border)" />
    </svg>
  );
}

function FranceVisual() {
  return (
    <svg viewBox="0 0 800 200" className="h-full w-full" aria-hidden="true">
      <rect width="800" height="200" fill="var(--bg-secondary)" />
      <path d="M 0 170 Q 200 130, 400 160 T 800 140 L 800 200 L 0 200 Z" fill="var(--accent-light)" opacity="0.3" />
      <line x1="300" y1="100" x2="300" y2="170" stroke="var(--text-muted)" strokeWidth="1" opacity="0.3" />
      <line x1="500" y1="110" x2="500" y2="170" stroke="var(--text-muted)" strokeWidth="1" opacity="0.3" />
      <path d="M 100 155 Q 400 145, 700 155" fill="none" stroke="var(--action)" strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

function ParisVisual() {
  return (
    <svg viewBox="0 0 800 200" className="h-full w-full" aria-hidden="true">
      <rect width="800" height="200" fill="var(--bg-hover)" />
      <path d="M 380 170 L 400 50 L 420 170 Z" fill="var(--text-primary)" opacity="0.15" />
      <line x1="370" y1="100" x2="430" y2="100" stroke="var(--text-primary)" strokeWidth="2" opacity="0.1" />
      <rect x="150" y="90" width="80" height="60" fill="var(--text-muted)" opacity="0.2" rx="2" />
      <rect x="550" y="85" width="70" height="65" fill="var(--text-muted)" opacity="0.2" rx="2" />
      <path d="M 0 165 L 800 165" stroke="var(--accent)" strokeWidth="2" opacity="0.4" />
    </svg>
  );
}

function RichmondVisual() {
  return (
    <svg viewBox="0 0 800 200" className="h-full w-full" aria-hidden="true">
      <rect width="800" height="200" fill="var(--bg-primary)" />
      <path d="M 0 140 Q 200 100, 400 130 T 800 110" fill="none" stroke="var(--text-primary)" strokeWidth="3" opacity="0.15" />
      <path d="M 0 155 Q 250 125, 500 145 T 800 135" fill="none" stroke="var(--action)" strokeWidth="2" opacity="0.3" />
      <rect x="600" y="80" width="120" height="8" fill="var(--text-muted)" opacity="0.2" rx="4" />
      <circle cx="200" cy="148" r="6" fill="var(--accent)" />
    </svg>
  );
}

function MakuriVisual() {
  return (
    <svg viewBox="0 0 800 200" className="h-full w-full" aria-hidden="true">
      <rect width="800" height="200" fill="var(--accent-light)" opacity="0.25" />
      <path d="M 100 170 Q 150 100, 200 170" fill="none" stroke="var(--accent-dark)" strokeWidth="2" opacity="0.4" />
      <path d="M 350 170 Q 400 90, 450 170" fill="none" stroke="var(--accent-dark)" strokeWidth="2" opacity="0.4" />
      <path d="M 600 170 Q 650 110, 700 170" fill="none" stroke="var(--accent-dark)" strokeWidth="2" opacity="0.4" />
      <circle cx="400" cy="60" r="30" fill="var(--action)" opacity="0.15" />
      <path d="M 0 175 Q 400 150, 800 170" fill="none" stroke="var(--text-primary)" strokeWidth="2" opacity="0.15" />
    </svg>
  );
}

function BolognaVisual() {
  return (
    <svg viewBox="0 0 800 200" className="h-full w-full" aria-hidden="true">
      <rect width="800" height="200" fill="var(--bg-secondary)" />
      <path d="M 350 170 Q 400 90, 450 170" fill="none" stroke="var(--action)" strokeWidth="2" opacity="0.35" />
      <rect x="320" y="100" width="160" height="70" fill="var(--text-muted)" opacity="0.15" rx="4" />
      <path d="M 0 165 Q 400 140, 800 165" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.4" />
    </svg>
  );
}

function DefaultVisual() {
  return (
    <svg viewBox="0 0 800 200" className="h-full w-full" aria-hidden="true">
      <rect width="800" height="200" fill="var(--bg-card)" />
      <path d="M 0 150 Q 400 100, 800 150" fill="none" stroke="var(--accent)" strokeWidth="2" />
    </svg>
  );
}

const worldComponents: Record<string, () => React.JSX.Element> = {
  Watopia: WatopiaVisual,
  London: LondonVisual,
  "New York": NewYorkVisual,
  Innsbruck: InnsbruckVisual,
  Yorkshire: YorkshireVisual,
  France: FranceVisual,
  Paris: ParisVisual,
  Richmond: RichmondVisual,
  "Makuri Islands": MakuriVisual,
  Bologna: BolognaVisual,
};

export function WorldVisual({ world }: WorldVisualProps) {
  const Visual = worldComponents[world] ?? DefaultVisual;

  return (
    <div
      className="result-visual overflow-hidden rounded-xl"
      style={{
        height: 160,
        border: "1px solid var(--border)",
      }}
    >
      <Visual />
    </div>
  );
}
