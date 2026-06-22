type StepPreviewProps = {
  variant: "configure" | "location" | "export";
};

export function StepPreview({ variant }: StepPreviewProps) {
  if (variant === "configure") {
    return (
      <div className="mk-step-visual" aria-hidden="true">
        <div className="mk-step-chip">Cycling</div>
        <div className="mk-step-chip is-active font-data">50 km</div>
        <div className="mk-step-chip">70 km</div>
      </div>
    );
  }

  if (variant === "location") {
    return (
      <div className="mk-step-visual mk-step-visual--map" aria-hidden="true">
        <svg viewBox="0 0 160 100">
          <rect width="160" height="100" rx="8" fill="#edeae3" />
          <path
            d="M20 70 Q 50 30 80 55 T 140 40"
            fill="none"
            stroke="#c4622d"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="80" cy="55" r="5" fill="#c4622d" />
        </svg>
      </div>
    );
  }

  return (
    <div className="mk-step-visual mk-step-visual--gpx" aria-hidden="true">
      <div className="mk-gpx-file">
        <span className="mk-gpx-icon font-data">GPX</span>
        <div>
          <p>loop-50km.gpx</p>
          <p className="font-data">Garmin · Wahoo · Strava</p>
        </div>
      </div>
    </div>
  );
}
