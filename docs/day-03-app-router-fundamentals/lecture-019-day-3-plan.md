# Lecture 19 - Day (3) Plan | خطة اليوم الثالث

## Goal

Preview Day 3 as the first routing-focused day: introduce the Next.js App Router mental model and ship a small but real job-board route skeleton.

## Implementation Status

Planned (this lecture is the day opener; routing work lands in Lectures 20–28)

## Key Files (as implemented today)

- `app/layout.tsx` — root HTML shell (fonts, globals, providers added in later days)
- `app/(client)/page.tsx` — home route (evolved beyond Day 3; originally `app/page.tsx`)
- `app/(client)/jobs/page.tsx` — jobs listing (evolved; originally `app/jobs/page.tsx`)
- `app/(client)/jobs/[id]/page.tsx` — dynamic job details (evolved; originally `app/jobs/[id]/page.tsx`)

## What Was Built

Day 3 does not add code in this lecture. Outcome preview: three public routes (`/`, `/jobs`, `/jobs/[id]`) built with file-system routing instead of abstract demo pages.

## Implementation steps

### Step 1: Open the Day 3 lecture index

Read `docs/day-03-app-router-fundamentals/README.md` and confirm Lectures 19–29 are listed in order.

### Step 2: Preview the target `app/` tree

Target folder tree (historical Day 3 paths; today's repo uses `(client)`):

```
app/
├── layout.tsx
├── page.tsx              → /
└── jobs/
    ├── page.tsx          → /jobs
    └── [id]/
        └── page.tsx      → /jobs/:id
```

Note: routes were created at `app/jobs/` in commit `1a56240`; they now live under `app/(client)/` after Day 4 route groups.

### Step 3: Skim today's equivalent routes

Open these files without editing — same URLs are built in Lectures 22–26:

- `app/(client)/page.tsx` — home
- `app/(client)/jobs/page.tsx` — jobs list
- `app/(client)/jobs/[id]/page.tsx` — job details

### Step 4: Review lecture sequence

Lecture order: mental model (20) → Pages Router contrast (21) → root layout (22) → nested `/jobs` (23) → dynamic `[id]` (24) → `params` (25) → `Link` (26) → milestone (27) → deploy (28) → recap (29).

### Step 5: Anchor the milestone commit

Run `git show 1a56240 --stat` to review the original Day 3 file paths (`app/page.tsx`, `app/jobs/...`).

## Verify
- Lecture index lists 19–29.
- You can explain URL ↔ folder mapping for all three routes.
- You mention the `(client)` move as a future Day 4 change, not a Day 3 blocker.
- Confirm `docs/day-03-app-router-fundamentals/README.md` lists Lectures 19–29.
- Skim `app/(client)/` to see the current equivalent of Day 3 routes.
- Optional history check: `git show 1a56240 --stat` for the original Day 3 file paths.

## Outcome

Clear Day 3 scope: three public routes via file-system routing, lecture sequence 20–29, and milestone commit `1a56240` as the routing anchor.

## Notes / Gaps

- The home and jobs pages now fetch real data from services; Day 3 used simpler placeholder UI.
- Route groups `(client)` did not exist on Day 3 — note that move when comparing old commits.
- No `layout.tsx` in the client group on Day 3; that arrives in Day 5.

## Next

[Lecture 20 - App Router Mental Model](./lecture-020-app-router-mental-model.md)
