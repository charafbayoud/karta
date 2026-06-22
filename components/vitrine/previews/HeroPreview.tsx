/** Product hero mockup — indoor quiz + outdoor loop side by side */
export function HeroPreview() {
  return (
    <div className="mk-preview mk-preview-hero" aria-hidden="true">
      <div className="mk-preview-panel mk-preview-panel--indoor">
        <div className="mk-preview-chrome">
          <span />
          <span />
          <span />
        </div>
        <p className="mk-preview-label">Ride Indoor</p>
        <div className="mk-preview-quiz">
          <div className="mk-preview-pill is-active">45 min</div>
          <div className="mk-preview-pill">Intermediate</div>
          <div className="mk-preview-pill">Endurance</div>
        </div>
        <div className="mk-preview-route-card">
          <p className="mk-preview-route-name">France Douce France</p>
          <p className="mk-preview-route-meta font-data">23 km · ~55 min</p>
          <div className="mk-preview-route-bar" />
        </div>
      </div>
      <div className="mk-preview-panel mk-preview-panel--outdoor">
        <div className="mk-preview-chrome">
          <span />
          <span />
          <span />
        </div>
        <p className="mk-preview-label">Ride Outdoor</p>
        <div className="mk-preview-map">
          <svg viewBox="0 0 200 120" className="mk-preview-map-svg">
            <path
              d="M20 90 Q 60 20, 100 70 T 180 40 L 180 90 Z"
              fill="rgba(124,180,154,0.12)"
            />
            <path
              d="M30 85 Q 70 35, 110 65 T 170 50"
              fill="none"
              stroke="#c4622d"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="30" cy="85" r="4" fill="#c4622d" />
            <circle cx="170" cy="50" r="4" fill="#5a9480" />
          </svg>
        </div>
        <p className="mk-preview-route-meta font-data">30 km loop · GPX ready</p>
      </div>
    </div>
  );
}
