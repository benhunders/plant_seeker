# 🌿 Plant Seeker

A mobile-first web app: snap a photo of a plant, identify it, get simple care
guidance, ask follow-up care questions, and keep a care schedule over time.

## How it works

- **Next.js (App Router) + TypeScript + Tailwind** — a phone-friendly web app.
- **Claude vision** (`@anthropic-ai/sdk`) runs server-side only, in two API
  routes:
  - `POST /api/identify` — image → identification, care overview, and a starter
    care schedule (structured JSON).
  - `POST /api/chat` — plant context + messages → a care answer.
- **Local storage** — saved plants and schedules live in the browser
  (`localStorage`). No accounts, no backend database.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000. On a phone, the "Identify a plant" button opens the
camera; on desktop it opens a file picker.

## User flow

1. **Home** — tap **Identify a plant**, take/choose a photo.
2. **Result** — see the name, a "care at a glance" card, and a starter schedule;
   tap **Save to my plants**.
3. **My plants** — a "Today" list of care tasks that are due, plus all saved
   plants.
4. **Plant detail** — the care card, the schedule (mark tasks **Done** to
   advance them), and an **Ask about this plant** chat box.

## Deploying to Vercel

Import the repo in Vercel and set the `ANTHROPIC_API_KEY` environment variable.
The default build (`npm run build`) is used as-is.

## Not in the MVP (future ideas)

Accounts / cross-device sync, push reminders, calendar integration, and a
dedicated plant-ID API for higher species accuracy.
