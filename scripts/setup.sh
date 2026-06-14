#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env.local"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║         KARTA — Service Setup            ║"
echo "╚══════════════════════════════════════════╝"
echo ""

if [[ -f "$ENV_FILE" ]]; then
  echo "Found existing .env.local"
else
  cp "$ROOT/.env.example" "$ENV_FILE"
  echo "Created .env.local from .env.example"
fi

echo ""
echo "── Step 1: Supabase ───────────────────────"
echo ""
echo "1. Go to https://supabase.com/dashboard and create a project"
echo "2. Open Project Settings → API and copy:"
echo "   • Project URL          → NEXT_PUBLIC_SUPABASE_URL"
echo "   • anon public key      → NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   • service_role key     → SUPABASE_SERVICE_ROLE_KEY"
echo "3. Open SQL Editor and paste the contents of:"
echo "   $ROOT/supabase/seed.sql"
echo "4. Run the query to create tables + seed 25 routes"
echo ""

echo "── Step 2: Resend ─────────────────────────"
echo ""
echo "1. Go to https://resend.com/api-keys and create an API key"
echo "2. Copy it → RESEND_API_KEY"
echo "3. Verify a sending domain at https://resend.com/domains"
echo "4. Set RESEND_FROM_EMAIL e.g. KARTA <hello@yourdomain.com>"
echo "   (For testing, use onboarding@resend.dev with your Resend account email)"
echo ""

echo "── Step 3: App URL ────────────────────────"
echo ""
echo "Set NEXT_PUBLIC_APP_URL=http://localhost:3000 for local dev"
echo ""

echo "── Step 4: Local dev (no credentials yet) ─"
echo ""
echo "The app works immediately without Supabase/Resend:"
echo "  • Routes use built-in seed data (25 Zwift routes)"
echo "  • Waitlist emails saved to .data/waitlist.json"
echo "  • Welcome emails are skipped until Resend is configured"
echo ""
echo "To force local mode even with Supabase configured:"
echo "  KARTA_USE_LOCAL_DATA=true"
echo ""

echo "── Step 5: Run ────────────────────────────"
echo ""
echo "  cd $ROOT"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "  Landing:  http://localhost:3000"
echo "  App:      http://localhost:3000/app"
echo "  Health:   http://localhost:3000/api/health"
echo ""

if command -v open >/dev/null 2>&1; then
  read -r -p "Open Supabase dashboard? [y/N] " OPEN_SUPABASE
  if [[ "$OPEN_SUPABASE" =~ ^[Yy]$ ]]; then
    open "https://supabase.com/dashboard"
  fi

  read -r -p "Open Resend dashboard? [y/N] " OPEN_RESEND
  if [[ "$OPEN_RESEND" =~ ^[Yy]$ ]]; then
    open "https://resend.com/api-keys"
  fi
fi

echo ""
echo "Edit your credentials:"
echo "  $ENV_FILE"
echo ""
