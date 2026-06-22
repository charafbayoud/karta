-- Add Strava athlete id for "Sign up with Strava" account matching
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS strava_athlete_id BIGINT UNIQUE;

CREATE INDEX IF NOT EXISTS profiles_strava_athlete_id_idx
  ON public.profiles(strava_athlete_id)
  WHERE strava_athlete_id IS NOT NULL;
