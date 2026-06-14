# KARTA

Route recommendation platform for Zwift riders. KARTA finds the perfect Zwift route based on your available time, experience level, and training goal.

## Features

- **Landing page** (`/`) — Early access waitlist with Supabase storage and Resend welcome emails
- **Route finder** (`/app`) — Input form with time, level, and goal selection
- **Loading animation** — 2-second CSS/SVG sequence (route draw, bike slide, finish line, medal)
- **Recommendation engine** — Duration-first matching with training goal filters
- **Result page** (`/app/result`) — Route details, world atmosphere SVG, and dynamic "Why this route" copy

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- Supabase (waitlist + routes tables)
- Resend (welcome emails)

## Getting Started

### Quick start (no credentials needed)

A `.env.local` is already configured for local dev. The app runs immediately with:

- **25 built-in Zwift routes** (no Supabase required)
- **Waitlist stored locally** at `.data/waitlist.json`
- **Welcome emails skipped** until Resend is configured

```bash
cd ~/Projects/karta
npm install
npm run dev
```

Check service status at [http://localhost:3000/api/health](http://localhost:3000/api/health).

### Wire up Supabase + Resend

Run the interactive setup guide:

```bash
npm run setup
```

Or follow these steps manually:

#### 1. Supabase

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`
3. Open **SQL Editor**, paste `supabase/seed.sql`, and run it
4. In `.env.local`, uncomment the Supabase lines and paste your keys
5. Set `KARTA_USE_LOCAL_DATA=false` (or remove the line)

#### 2. Resend

1. Create an API key at [resend.com/api-keys](https://resend.com/api-keys)
2. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxx
   RESEND_FROM_EMAIL=KARTA <hello@yourdomain.com>
   ```
3. For quick testing, Resend allows `onboarding@resend.dev` as the sender — emails only deliver to the address on your Resend account
4. Verify your own domain at [resend.com/domains](https://resend.com/domains) for production

#### 3. Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Service role key (server API routes) |
| `RESEND_API_KEY` | For emails | Resend API key |
| `RESEND_FROM_EMAIL` | For emails | Verified sender address |
| `NEXT_PUBLIC_APP_URL` | Yes | App URL for email CTA links |
| `KARTA_USE_LOCAL_DATA` | No | Force local mode (`true` / `false`) |

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page and [http://localhost:3000/app](http://localhost:3000/app) for the route finder.

## Project Structure

```
app/
  page.tsx                 Landing page
  app/page.tsx             Route finder (step 1)
  app/result/page.tsx      Result display
  api/waitlist/route.ts    Email submission
  api/recommend/route.ts   Recommendation API
components/
  landing/                 Landing page sections
  app/                     App UI components
lib/
  supabase.ts              Supabase client
  resend.ts                Resend client + welcome email
  recommend.ts             Recommendation logic
  env.ts                   Service configuration helpers
  seed-routes.ts           Built-in 25-route dataset
  routes.ts                Fetch routes (Supabase or local)
  waitlist.ts              Waitlist storage (Supabase or local file)
types/
  route.ts                 Shared types and helpers
supabase/
  seed.sql                 Schema + 25 route seed data
```

## Design System

Light mode only. Premium, minimal, cycling-inspired aesthetic with:

- **Headings:** Playfair Display
- **UI:** Helvetica Neue (system fallback)
- **Data:** Courier Prime
- **Action color:** Matte orange `#C4622D`
- **Accent:** Sage green `#7CB49A`

## Recommendation Rules

1. Match duration using `estimated_time_*` for the selected rider level (±15 min tolerance)
2. Filter by training goal:
   - Recovery → elevation < 100m
   - Endurance → distance 20–50 km
   - Climbing → elevation > 500m
   - Challenge → difficulty = epic
   - Surprise Me → random valid route within duration
3. Fall back to closest duration match with adjustment note

## License

Private — All rights reserved.
