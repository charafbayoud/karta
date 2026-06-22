import type { RouteCircuitSchema } from "@/lib/route-circuit-schema";

interface LandingRouteSchematicProps {
  schema: RouteCircuitSchema;
  compact?: boolean;
}

export function LandingRouteSchematic({ schema, compact }: LandingRouteSchematicProps) {
  return (
    <div
      className={`lp-route-schematic${compact ? " lp-route-schematic--compact" : ""}`}
      aria-hidden="true"
    >
      <div className="lp-route-schematic-map">
        <svg viewBox="0 0 200 200" className="lp-route-schematic-map-svg">
          <rect width="200" height="200" fill="#ececef" />
          <path
            d={schema.circuitPoints}
            fill="none"
            stroke="rgba(20,20,20,0.1)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={schema.circuitPoints}
            fill="none"
            stroke="#141414"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx={schema.start.x}
            cy={schema.start.y}
            r="5"
            fill="#C8F560"
            stroke="#141414"
            strokeWidth="1.5"
          />
        </svg>
        <span className="lp-route-schematic-badge">
          {schema.isLoop ? "Loop" : "Out & back"}
        </span>
      </div>
      <div className="lp-route-schematic-elevation">
        <svg viewBox="0 0 120 48" preserveAspectRatio="none">
          <path d={schema.elevationFill} fill="rgba(200,245,96,0.45)" />
          <path
            d={schema.elevationPath}
            fill="none"
            stroke="#141414"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
