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

## Recording Outline

1. Audit remaining direct mock references (grep `JobsData`).
2. Update home `FeaturedJobs` data path.
3. Update admin dashboard stats job count.
4. Update job management table data source.
5. Run app — confirm no import errors after deleting `JobsData.ts` (deletion may be Day 9).

## Verify in Repo

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
