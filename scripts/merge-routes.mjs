/**
 * Merge route CSV into seed data. Run: node scripts/merge-routes.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const CSV = `route_name,world,continent,distance_km,elevation_m,difficulty,tags,estimated_time_intermediate
Watopia Hilly Route,Watopia,Oceania,10.5,150,medium,endurance;climbing,25
Watopia Flat Route,Watopia,Oceania,8.0,30,easy,endurance,20
Watopia Volcano Circuit,Watopia,Oceania,9.2,120,medium,endurance,22
Watopia Ocean Loop,Watopia,Oceania,11.3,90,easy,endurance,28
Watopia Jungle Loop,Watopia,Oceania,12.5,200,medium,climbing,30
Watopia Figure 8,Watopia,Oceania,14.0,180,medium,endurance,35
Watopia Volcano Climb,Watopia,Oceania,6.8,300,hard,climbing,20
Watopia Mountain Route,Watopia,Oceania,18.0,650,hard,climbing,50
Watopia Tempus Fugit,Watopia,Oceania,15.0,20,easy,endurance,35
Watopia Sand and Sequoias,Watopia,Oceania,19.5,400,hard,endurance;climbing,55
France Douce France,France,Europe,23.0,200,easy,endurance,55
France R.G.V.,France,Europe,12.0,90,easy,endurance,30
France Petit Boucle,France,Europe,14.5,150,medium,endurance,35
France Lutece Express,France,Europe,11.0,80,easy,endurance,28
France Champs Loop,France,Europe,9.0,50,easy,recovery,22
London Loop,London,Europe,16.5,250,medium,endurance,40
London Classique,London,Europe,12.3,180,medium,endurance,30
London Greater Loop,London,Europe,18.0,300,hard,endurance;climbing,45
London Flat Out,London,Europe,10.0,40,easy,endurance,25
London Triple Loop,London,Europe,20.0,400,hard,climbing,55
New York Central Park Loop,New York,North America,11.5,200,medium,endurance,30
New York Gotham Grind,New York,North America,14.0,450,hard,climbing,40
New York Everything Bagel,New York,North America,17.0,600,hard,climbing,50
New York Park Perimeter,New York,North America,9.5,150,easy,endurance,25
New York Midtown Loop,New York,North America,12.0,220,medium,endurance,30
Richmond Flat Circuit,Richmond,North America,10.5,60,easy,recovery,25
Richmond UCI Circuit,Richmond,North America,15.0,180,medium,endurance,40
Richmond Rolling Course,Richmond,North America,13.0,300,medium,endurance;climbing,35
Innsbruckring,Innsbruck,Europe,8.0,120,medium,endurance,20
Innsbruck KOM Circuit,Innsbruck,Europe,12.0,500,hard,climbing,35
Innsbruck Short Loop,Innsbruck,Europe,6.5,90,easy,recovery,18
Makuri Islands Countryside,Makuri Islands,Asia,15.0,200,medium,endurance,40
Makuri Islands Village Loop,Makuri Islands,Asia,10.0,100,easy,endurance,25
Makuri Islands River Ride,Makuri Islands,Asia,12.5,150,medium,endurance,30
Makuri Islands Mountain Pass,Makuri Islands,Asia,18.0,700,hard,climbing,55
Makuri Islands Sprint Loop,Makuri Islands,Asia,9.0,80,easy,intervals,22
Bologna Time Trial,Bologna,Europe,8.0,220,hard,climbing,20
Bologna Circuit,Bologna,Europe,12.5,300,medium,endurance,30
Bologna Hill Loop,Bologna,Europe,14.0,450,hard,climbing,40
Paris Flat Sprint,Paris,Europe,10.0,40,easy,sprint,25
Paris Champs Loop,Paris,Europe,11.0,60,easy,endurance,28
Paris Montmartre Climb,Paris,Europe,6.0,250,hard,climbing,18
Watopia Seaside Sprint,Watopia,Oceania,7.0,20,easy,sprint,15
Watopia Jungle Circuit,Watopia,Oceania,13.0,220,medium,endurance,35
Watopia Epic Climb,Watopia,Oceania,22.0,1200,hard,climbing,75
Watopia Out and Back Again,Watopia,Oceania,16.0,300,medium,endurance,40
Watopia Flat Volcano Loop,Watopia,Oceania,9.5,60,easy,endurance,22
Watopia Mountain 8,Watopia,Oceania,20.0,800,hard,climbing,60
Watopia Coastal Ride,Watopia,Oceania,14.0,120,medium,endurance,35
Watopia Short Spin,Watopia,Oceania,5.0,10,easy,recovery,12
Watopia Long Loop,Watopia,Oceania,25.0,600,hard,endurance,70
Watopia Recovery Spin,Watopia,Oceania,6.0,5,easy,recovery,15
Watopia Tempo Ride,Watopia,Oceania,18.0,250,medium,endurance,45
Watopia Climber's Dream,Watopia,Oceania,21.0,900,hard,climbing,65
Watopia Sprint Factory,Watopia,Oceania,8.0,30,easy,sprint,18
Watopia Rolling Hills,Watopia,Oceania,12.0,180,medium,endurance,30
Watopia Beginner Loop,Watopia,Oceania,7.5,40,easy,recovery,20
Watopia Advanced Loop,Watopia,Oceania,19.0,700,hard,endurance,55
Watopia Challenge Route,Watopia,Oceania,24.0,1000,hard,challenge,75
Watopia Easy Cruise,Watopia,Oceania,10.0,20,easy,recovery,25
Watopia Endurance Base,Watopia,Oceania,30.0,400,medium,endurance,90
Watopia Sweet Spot Loop,Watopia,Oceania,15.0,300,medium,endurance,40
Watopia Climb Repeat,Watopia,Oceania,13.0,650,hard,climbing,40
Watopia Sprint Training,Watopia,Oceania,9.0,50,easy,sprint,20
Watopia Recovery Ride Plus,Watopia,Oceania,11.0,30,easy,recovery,30
Watopia Epic Endurance,Watopia,Oceania,35.0,900,hard,endurance,100
Watopia Short Climb,Watopia,Oceania,6.0,200,medium,climbing,18
Watopia Long Climb,Watopia,Oceania,28.0,1300,hard,climbing,85
Watopia Mixed Terrain,Watopia,Oceania,17.0,500,medium,endurance,45
Watopia Fast Flat,Watopia,Oceania,12.0,10,easy,endurance,28
Watopia Race Prep,Watopia,Oceania,14.0,350,medium,challenge,35
Watopia Group Ride Loop,Watopia,Oceania,16.0,300,medium,endurance,40
Watopia Social Spin,Watopia,Oceania,10.0,100,easy,recovery,25
Watopia Evening Ride,Watopia,Oceania,13.0,200,medium,endurance,32
Watopia Morning Warmup,Watopia,Oceania,8.0,60,easy,recovery,20
Watopia Long Recovery,Watopia,Oceania,20.0,150,easy,recovery,55
Watopia Climb & Recover,Watopia,Oceania,19.0,700,hard,climbing,55
Watopia Power Ride,Watopia,Oceania,18.0,500,hard,challenge,50
Watopia Steady Ride,Watopia,Oceania,16.0,200,medium,endurance,40
Watopia Fun Loop,Watopia,Oceania,12.0,100,easy,endurance,30
Watopia Explorer Route,Watopia,Oceania,22.0,600,hard,challenge,65
Watopia Adventure Loop,Watopia,Oceania,25.0,800,hard,endurance,75
Watopia Daily Ride,Watopia,Oceania,15.0,300,medium,endurance,40
Watopia Training Loop,Watopia,Oceania,14.0,250,medium,endurance,35
Watopia Performance Loop,Watopia,Oceania,18.0,450,hard,challenge,50
Watopia Base Builder,Watopia,Oceania,26.0,500,medium,endurance,75
Watopia Fatigue Ride,Watopia,Oceania,20.0,700,hard,climbing,60
Watopia Recovery Flow,Watopia,Oceania,9.0,20,easy,recovery,22
Watopia Power Climb,Watopia,Oceania,15.0,800,hard,climbing,45
Watopia Endurance Plus,Watopia,Oceania,28.0,600,medium,endurance,80
Watopia Sprint & Spin,Watopia,Oceania,11.0,50,easy,sprint,28
Watopia Long Steady,Watopia,Oceania,32.0,700,hard,endurance,95
Watopia Climb Focus,Watopia,Oceania,21.0,1000,hard,climbing,65
Watopia Chill Ride,Watopia,Oceania,10.0,10,easy,recovery,25
Watopia Race Simulation,Watopia,Oceania,24.0,900,hard,challenge,70
Watopia Hill Intervals,Watopia,Oceania,13.0,400,medium,intervals,35
Watopia Tempo Builder,Watopia,Oceania,17.0,300,medium,endurance,45
Watopia Hard Ascent,Watopia,Oceania,19.0,1100,hard,climbing,60
Watopia Easy Spin,Watopia,Oceania,7.0,5,easy,recovery,18
Watopia Endurance Ride Pro,Watopia,Oceania,30.0,800,hard,endurance,90`;

const DIFFICULTY_MAP = {
  easy: "easy",
  medium: "moderate",
  moderate: "moderate",
  hard: "hard",
  epic: "epic",
};

function slugify(world, routeName) {
  return `${world}-${routeName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function deriveTimes(intermediate) {
  return {
    estimated_time_beginner: Math.round(intermediate * 1.32),
    estimated_time_intermediate: intermediate,
    estimated_time_advanced: Math.round(intermediate * 0.8),
    estimated_time_competitive: Math.round(intermediate * 0.67),
  };
}

function normalizeRouteName(name) {
  return name.trim().replace(/'/g, "'").toLowerCase();
}

function dedupeKey(route) {
  return `${route.world.toLowerCase()}|${normalizeRouteName(route.route_name)}`;
}

function parseCsv(csv) {
  const lines = csv.trim().split("\n").slice(1);
  return lines.map((line) => {
    const parts = line.split(",");
    const [
      route_name,
      world,
      continent,
      distance_km,
      elevation_m,
      difficulty,
      tags,
      estimated_time_intermediate,
    ] = parts;

    const intermediate = Number(estimated_time_intermediate);
    const mappedDifficulty = DIFFICULTY_MAP[difficulty] ?? "moderate";
    let finalDifficulty = mappedDifficulty;

    const tagList = tags.split(";").map((t) => t.trim()).filter(Boolean);
    if (tagList.includes("challenge") && mappedDifficulty === "hard" && Number(elevation_m) >= 900) {
      finalDifficulty = "epic";
    }

    return {
      route_name: route_name.trim(),
      world: world.trim(),
      continent: continent.trim(),
      distance_km: Number(distance_km),
      elevation_m: Number(elevation_m),
      difficulty: finalDifficulty,
      training_tags: tagList,
      ...deriveTimes(intermediate),
    };
  });
}

function loadExistingSeed() {
  const file = readFileSync(path.join(ROOT, "lib/seed-routes.ts"), "utf8");
  const match = file.match(/const seedData: SeedRoute\[\] = (\[[\s\S]*?\]);/);
  if (!match) throw new Error("Could not parse existing seed-routes.ts");

  const seedData = eval(match[1]);
  return seedData;
}

const existing = loadExistingSeed();
const incoming = parseCsv(CSV);

const merged = new Map();
for (const route of existing) {
  merged.set(dedupeKey(route), route);
}

let added = 0;
let skipped = 0;
for (const route of incoming) {
  const key = dedupeKey(route);
  if (merged.has(key)) {
    skipped++;
    continue;
  }
  merged.set(key, route);
  added++;
}

const allRoutes = [...merged.values()].sort((a, b) =>
  a.world.localeCompare(b.world) || a.route_name.localeCompare(b.route_name)
);

console.log(`Existing: ${existing.length}, Incoming: ${incoming.length}, Added: ${added}, Skipped duplicates: ${skipped}, Total: ${allRoutes.length}`);

function formatRoute(route) {
  const tags = route.training_tags.map((t) => `"${t}"`).join(", ");
  return `  {
    route_name: ${JSON.stringify(route.route_name)},
    world: ${JSON.stringify(route.world)},
    continent: ${JSON.stringify(route.continent)},
    distance_km: ${route.distance_km},
    elevation_m: ${route.elevation_m},
    difficulty: ${JSON.stringify(route.difficulty)},
    estimated_time_beginner: ${route.estimated_time_beginner},
    estimated_time_intermediate: ${route.estimated_time_intermediate},
    estimated_time_advanced: ${route.estimated_time_advanced},
    estimated_time_competitive: ${route.estimated_time_competitive},
    training_tags: [${tags}],
  }`;
}

const tsContent = `import type { Route } from "@/types/route";

type SeedRoute = Omit<Route, "id">;

const seedData: SeedRoute[] = [
${allRoutes.map(formatRoute).join(",\n")}
];

function slugify(world: string, routeName: string): string {
  return \`\${world}-\${routeName}\`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const SEED_ROUTES: Route[] = seedData.map((route) => ({
  id: slugify(route.world, route.route_name),
  ...route,
}));

export function getSeedRoutes(): Route[] {
  return SEED_ROUTES;
}
`;

writeFileSync(path.join(ROOT, "lib/seed-routes.ts"), tsContent);

const sqlValues = allRoutes
  .map(
    (r) =>
      `('${r.route_name.replace(/'/g, "''")}', '${r.world}', '${r.continent}', ${r.distance_km}, ${r.elevation_m}, '${r.difficulty}', ${r.estimated_time_beginner}, ${r.estimated_time_intermediate}, ${r.estimated_time_advanced}, ${r.estimated_time_competitive}, ARRAY[${r.training_tags.map((t) => `'${t.replace(/'/g, "''")}'`).join(", ")}])`
  )
  .join(",\n");

const sqlContent = readFileSync(path.join(ROOT, "supabase/seed.sql"), "utf8");
const updatedSql = sqlContent.replace(
  /INSERT INTO routes \([\s\S]*?\) VALUES[\s\S]*?;/,
  `INSERT INTO routes (
  route_name, world, continent, distance_km, elevation_m, difficulty,
  estimated_time_beginner, estimated_time_intermediate, estimated_time_advanced,
  estimated_time_competitive, training_tags
) VALUES
${sqlValues};`
);

writeFileSync(path.join(ROOT, "supabase/seed.sql"), updatedSql);

console.log("Updated lib/seed-routes.ts and supabase/seed.sql");
