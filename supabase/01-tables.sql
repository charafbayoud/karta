-- ═══════════════════════════════════════════════════════════════════════════
-- KARTA — ÉTAPE 1 : Créer les tables
-- Copie TOUT ce fichier dans Supabase SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_name TEXT NOT NULL,
  world TEXT NOT NULL,
  continent TEXT NOT NULL,
  distance_km NUMERIC(6,1) NOT NULL,
  elevation_m INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'moderate', 'hard', 'epic')),
  estimated_time_beginner INTEGER NOT NULL,
  estimated_time_intermediate INTEGER NOT NULL,
  estimated_time_advanced INTEGER NOT NULL,
  estimated_time_competitive INTEGER NOT NULL,
  training_tags TEXT[] NOT NULL DEFAULT '{}'
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on waitlist" ON waitlist;
CREATE POLICY "Service role full access on waitlist"
  ON waitlist FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read access on routes" ON routes;
CREATE POLICY "Public read access on routes"
  ON routes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role full access on routes" ON routes;
CREATE POLICY "Service role full access on routes"
  ON routes FOR ALL USING (true) WITH CHECK (true);

SELECT 'Tables créées ✓' AS status;
