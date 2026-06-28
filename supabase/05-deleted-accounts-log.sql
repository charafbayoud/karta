-- KARTA — deleted accounts audit log (GDPR compliance)
-- Run in Supabase SQL Editor after profiles migration.

CREATE TABLE IF NOT EXISTS public.deleted_accounts_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hash TEXT NOT NULL,
  deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason TEXT
);

CREATE INDEX IF NOT EXISTS deleted_accounts_log_deleted_at_idx
  ON public.deleted_accounts_log (deleted_at DESC);

ALTER TABLE public.deleted_accounts_log ENABLE ROW LEVEL SECURITY;

-- No public policies — service role only.
