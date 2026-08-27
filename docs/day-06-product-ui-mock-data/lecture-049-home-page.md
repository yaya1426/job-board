# Lecture 49 - Home Page

## Goal

Build the public landing page: hero section plus a featured-jobs strip so the app feels like a real job board on first load.

## Implementation Status

**Complete.** `HeroSection` and `FeaturedJobs` components exist. The home page now fetches jobs via `getJobs()` service (post–Day 9); originally used `JobsData` directly.

## Key Files (as implemented today)

- `app/(client)/page.tsx`
- `components/landing/HeroSection.tsx`
- `components/landing/FeaturedJobs.tsx`
- `services/jobs/jobs.service.ts` (current data source)

## What Was Built

- Landing route at `/` inside the `(client)` route group.
- Hero with primary CTA toward `/jobs`.
- Featured jobs grid fed from job data (mock on Day 6; service + MongoDB today).

## Implementation steps

### Step 1: Create the home page route

Create or open `app/(client)/page.tsx` as an async server component inside the `(client)` route group.

### Step 2: Build HeroSection

Build `components/landing/HeroSection.tsx` — headline, subcopy, and a `Link` + `Button` CTA pointing to `/jobs`.

### Step 3: Build FeaturedJobs

Build `components/landing/FeaturedJobs.tsx` accepting a `jobs: Job[]` prop. Slice the first four jobs and render a grid of linked cards (`/jobs/${job.id}`) showing company, title, type badge, tags, location, and salary.

### Step 4: Wire mock data on Day 6

On Day 6, import `JobsData` and pass it to `FeaturedJobs`. Wire the page:

```tsx
const jobs = JobsData; // Day 6
return (
  <>
    <HeroSection />
    <FeaturedJobs jobs={jobs} />
  </>
);
```

### Step 5: Confirm client layout wraps the page

Render `<HeroSection />` above `<FeaturedJobs jobs={jobs} />` and confirm the `(client)` layout from Day 5 wraps navbar/footer.

## Verify
```bash
# Commit evidence
git log --oneline --grep="Day 6: Home Page"
# -> 1dfd33f Day 6: Home Page UI (Landing)
- `HeroSection` and `FeaturedJobs` are imported in `app/(client)/page.tsx`.
- Page calls `getJobs()` and passes `jobs` to `FeaturedJobs`.

## Outcome

`/` renders a hero plus a four-card featured strip. Day 6 used mock `JobsData`; **current repo** fetches via `getJobs()` → MongoDB. Empty DB shows no featured cards until jobs are seeded or created in admin.

## Notes / Gaps

- Featured jobs may show an empty state if the database has no jobs; seed data or create a job in admin for demos.
- Layout chrome (navbar/footer) comes from Day 5 `(client)/layout.tsx`.

## Next

[Lecture 50 - Client: Jobs List Page](./lecture-050-client-jobs-list-page.md)
