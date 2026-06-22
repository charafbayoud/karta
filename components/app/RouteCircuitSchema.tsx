import type { RouteCircuitSchema as RouteCircuitSchemaData } from "@/lib/route-circuit-schema";
import type { Route } from "@/types/route";

interface RouteCircuitSchemaProps {
  route: Route;
  schema: RouteCircuitSchemaData;
}

export function RouteCircuitSchema({ route, schema }: RouteCircuitSchemaProps) {
  const distanceKm = Number(route.distance_km) || 0;
  const elevationM = Number(route.elevation_m) || 0;

  return (
    <div className="result-visual result-visual-schema" role="img" aria-label={`Route schematic for ${route.route_name}`}>
      <div className="result-schema-map">
        <svg viewBox="0 0 200 200" className="result-schema-map-svg" aria-hidden="true">
          <defs>
            <pattern
              id={`result-schema-grid-${schema.seed}`}
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 16 0 L 0 0 0 16"
                fill="none"
                stroke="rgba(20,20,20,0.06)"
                strokeWidth="0.75"
              />
            </pattern>
          </defs>
          <rect width="200" height="200" fill={`url(#result-schema-grid-${schema.seed})`} />
          <rect width="200" height="200" fill="rgba(244,244,246,0.55)" />
          <path
            d={schema.circuitPoints}
            fill="none"
            stroke="rgba(20,20,20,0.1)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={schema.circuitPoints}
            fill="none"
            stroke="#141414"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx={schema.start.x}
            cy={schema.start.y}
            r="5.5"
            fill="#C8F560"
            stroke="#141414"
            strokeWidth="1.5"
          />
          {!schema.isLoop && (
            <circle cx={schema.finish.x} cy={schema.finish.y} r="4.5" fill="#141414" />
          )}
        </svg>
        <div className="result-schema-map-meta">
          <span>{schema.isLoop ? "Boucle" : "Aller-retour"}</span>
          <span>{distanceKm} km</span>
        </div>
      </div>

      <div className="result-schema-elevation">
        <p className="result-schema-elevation-label">Profil altimétrique</p>
        <svg viewBox="0 0 120 48" preserveAspectRatio="none" aria-hidden="true">
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
        <div className="result-schema-elevation-meta font-data">
          <span>{elevationM} m D+</span>
          <span>{route.difficulty}</span>
        </div>
      </div>
    </div>
  );
}
