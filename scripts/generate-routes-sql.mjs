import { writeFileSync } from "fs";
import { getSeedRoutes } from "../lib/seed-routes.ts";

const routes = getSeedRoutes();

const values = routes
  .map((r) => {
    const tags = r.training_tags.map((t) => `'${t.replace(/'/g, "''")}'`).join(", ");
    const name = r.route_name.replace(/'/g, "''");
    return `('${name}', '${r.world}', '${r.continent}', ${r.distance_km}, ${r.elevation_m}, '${r.difficulty}', ${r.estimated_time_beginner}, ${r.estimated_time_intermediate}, ${r.estimated_time_advanced}, ${r.estimated_time_competitive}, ARRAY[${tags}])`;
  })
  .join(",\n");

const sql = `-- ═══════════════════════════════════════════════════════════════════════════
-- KARTA — ÉTAPE 2 : Insérer les ${routes.length} circuits
-- Exécute APRÈS 01-tables.sql avec succès
-- Cmd+A → Copier → Coller dans Supabase SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════════════════

DELETE FROM routes;

INSERT INTO routes (
  route_name, world, continent, distance_km, elevation_m, difficulty,
  estimated_time_beginner, estimated_time_intermediate, estimated_time_advanced,
  estimated_time_competitive, training_tags
) VALUES
${values};

SELECT COUNT(*) AS nombre_de_circuits FROM routes;
`;

writeFileSync(new URL("../supabase/02-routes.sql", import.meta.url), sql);
console.log(`Generated 02-routes.sql with ${routes.length} routes`);
