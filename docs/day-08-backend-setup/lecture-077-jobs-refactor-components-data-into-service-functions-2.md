# Lecture 77 - Jobs: Refactor Components Data into Service Functions (2)

## Goal
Finish jobs migration: every page and server component that displayed jobs now fetches via `getJobs()` or `getJob()` instead of props from mock imports or context seed data.

## Implementation Status
**Complete.** All job pages use service layer.

## Key Files
- `app/(client)/page.tsx`
- `app/(client)/jobs/page.tsx`
- `app/(client)/jobs/[id]/page.tsx`
- `app/(admin)/dashboard/page.tsx`
- `app/(admin)/dashboard/jobs/page.tsx`
- `app/(admin)/dashboard/jobs/[jobId]/edit/page.tsx`
- `components/jobs/JobsListingWrapper.tsx` (receives jobs prop from server parent)

## What Was Built
- Server pages async-fetch jobs and pass serializable props to client wrappers.
- `JobsProvider` still used for client filters but initialized from server-fetched `jobs` prop.
- Admin job edit page loads job via `getJob(jobId)`.

## Implementation steps
### Step 1

Audit remaining direct mock references:

```bash
rg "JobsData" --glob '!docs/**'
```

Target zero matches outside docs.

### Step 2

Update `app/(client)/page.tsx` — `getJobs()` → pass to `FeaturedJobs`.

### Step 3

Update admin pages:
- `app/(admin)/dashboard/page.tsx` — `getJobs()` for stats
- `app/(admin)/dashboard/jobs/page.tsx` — `getJobs()` for table
- `app/(admin)/dashboard/jobs/[jobId]/edit/page.tsx` — `getJob(jobId)`

### Step 4

Confirm `JobsListingWrapper` still receives `jobs: Job[]` from server parent — `JobsProvider` initializes filter state from server-fetched prop.

### Step 5

Run the app — no import errors. Delete `JobsData.ts` when all pages migrated (deletion may land Day 9 with repository swap).

### Verify

```bash
rg "JobsData" --glob '!docs/**'
# No matches
```

- All listed pages import from `@/services/jobs/jobs.service`.
- `JobsListingWrapper` signature: `{ jobs: Job[] }` from parent fetch.
- Context providers remain for UI filters only.

### End State

Every job-consuming page fetches via service. **Current repo** services call MongoDB repositories; applicant counts use `$lookup` aggregation. `JobsData.ts` is gone.

## Verify
```bash
rg "JobsData" --glob '!docs/**'
# No matches outside docs
```

- All listed pages import from `@/services/jobs/jobs.service`.
- `JobsListingWrapper` signature: `{ jobs: Job[] }` from parent fetch.

## Notes/Gaps
- Context providers remain for UI filter state — not a data cache layer.
- Applicant counts require DB aggregation (Day 9) — may differ from Day 6 mock.

## Next
Lecture 078 — applications service refactor.
