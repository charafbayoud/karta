-- KARTA V2 — profiles, saved routes, Strava cache
-- Run after 01-tables.sql and 02-routes.sql in Supabase SQL Editor.

-- Rename routes table to zwift_routes if still using legacy name
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'routes'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'zwift_routes'
  ) THEN
    ALTER TABLE public.routes RENAME TO zwift_routes;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  primary_sport TEXT CHECK (primary_sport IN ('cycling', 'running', 'walking')),
  primary_experience TEXT CHECK (primary_experience IN ('indoor', 'outdoor', 'both')),
  strava_connected BOOLEAN NOT NULL DEFAULT FALSE,
  strava_access_token TEXT,
  strava_refresh_token TEXT,
  strava_token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.saved_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  route_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('indoor', 'outdoor', 'gps-art')),
  sport TEXT CHECK (sport IN ('cycling', 'running', 'walking')),
  distance_km NUMERIC(8, 2),
  elevation_m INTEGER,
  duration_min INTEGER,
  gpx_data TEXT,
  map_preview_url TEXT,
  shape_type TEXT,
  zwift_world TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.strava_segments_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_id BIGINT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sport TEXT,
  distance_km NUMERIC(8, 2),
  elevation_m INTEGER,
  popularity_score INTEGER,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  polyline TEXT,
  cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strava_segments_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by owner"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Profiles are insertable by owner"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles are updatable by owner"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Saved routes viewable by owner"
  ON public.saved_routes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Saved routes insertable by owner"
  ON public.saved_routes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Saved routes deletable by owner"
  ON public.saved_routes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS saved_routes_user_id_idx ON public.saved_routes(user_id);
CREATE INDEX IF NOT EXISTS saved_routes_created_at_idx ON public.saved_routes(created_at DESC);
