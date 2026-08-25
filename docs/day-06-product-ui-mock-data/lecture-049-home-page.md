# Lecture 49 - Home Page

## Goal

Build the public landing page: hero section plus a featured-jobs strip so the app feels like a real job board on first load.

## Implementation Status

**Complete.** `HeroSection` and `FeaturedJobs` components exist. The home page now fetches jobs via `getJobs()` service (post–Day 9); originally used `JobsData` directly.

## Key Files

- `app/(client)/page.tsx`
- `components/landing/HeroSection.tsx`
- `components/landing/FeaturedJobs.tsx`
- `services/jobs/jobs.service.ts` (current data source)

## What Was Built

- Landing route at `/` inside the `(client)` route group.
- Hero with primary CTA toward `/jobs`.
- Featured jobs grid fed from job data (mock on Day 6; service + MongoDB today).

## Recording Outline

1. Open `app/(client)/page.tsx` and explain server-component page structure.
2. Build or review `HeroSection` — headline, subcopy, CTA.
3. Build `FeaturedJobs` — accept a `jobs` prop, render cards.
4. Wire mock `JobsData` on Day 6; note the later swap to `getJobs()`.
5. Load `localhost:3000` (or `dev.wazifa.app`) and confirm the landing renders.

## Verify in Repo

```bash
# Commit evidence
git log --oneline --grep="Day 6: Home Page"
# -> 1dfd33f Day 6: Home Page UI (Landing)
```

- `HeroSection` and `FeaturedJobs` are imported in `app/(client)/page.tsx`.
- Page calls `getJobs()` and passes `jobs` to `FeaturedJobs`.

## Notes/Gaps

- Featured jobs may show an empty state if the database has no jobs; seed data or create a job in admin for demos.
- Layout chrome (navbar/footer) comes from Day 5 `(client)/layout.tsx`.

## Next

Lecture 050 — jobs listing page with search and filters.
