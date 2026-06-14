"use client";

export function LoadingAnimation() {
  return (
    <div
      className="loading-sequence flex flex-col items-center"
      aria-label="Finding your route"
      role="img"
    >
      <svg
        viewBox="0 0 400 120"
        width="100%"
        className="loading-svg mx-auto"
        style={{ maxWidth: 400 }}
        aria-hidden="true"
      >
        <path
          id="route-path"
          d="M 40 80 Q 120 20, 200 60 T 360 40"
          fill="none"
          stroke="transparent"
        />

        <path
          className="route-line route-stroke"
          d="M 40 80 Q 120 20, 200 60 T 360 40"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <g className="finish-line" opacity="0">
          <line className="finish-stroke" x1="355" y1="25" x2="355" y2="55" strokeWidth="2" />
          <line className="finish-stroke" x1="365" y1="25" x2="365" y2="55" strokeWidth="2" />
          <line className="finish-stroke" x1="375" y1="25" x2="375" y2="55" strokeWidth="2" />
        </g>

        <circle className="bike-dot" r="6">
          <animateMotion
            dur="1.2s"
            begin="0.4s"
            fill="freeze"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.42 0 0.58 1"
          >
            <mpath href="#route-path" />
          </animateMotion>
        </circle>

        <g className="medal-icon medal-accent" transform="translate(340, 70)" opacity="0">
          <circle cx="0" cy="0" r="14" fill="none" strokeWidth="2" />
          <circle className="medal-accent" cx="0" cy="-2" r="5" />
          <path
            className="medal-accent"
            d="M -6 6 L 0 14 L 6 6"
            fill="none"
            strokeWidth="2"
          />
        </g>
      </svg>

      <p className="loading-caption">Mapping your perfect ride…</p>
    </div>
  );
}
