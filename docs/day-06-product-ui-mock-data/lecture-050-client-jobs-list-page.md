# Lecture 50 - Client: Jobs List Page

## Goal

Build the public jobs listing page with filter sidebar and job cards so candidates can browse all open positions.

## Implementation Status

**Complete.** Jobs list UI and `JobsProvider` context exist. Data now flows from `getJobs()` → `JobsListingWrapper` instead of direct `JobsData` import.

## Key Files

- `app/(client)/jobs/page.tsx`
- `components/jobs/JobsListingWrapper.tsx`
- `components/jobs/JobCards.tsx`
- `components/jobs/FilterSidebar.tsx`
- `context/jobs/JobsProvider.tsx`
- `context/jobs/JobsContext.tsx`

## What Was Built

- `/jobs` route with server page passing job array into a client wrapper.
- `JobsProvider` holding search text, type filter, and location filter state.
- `FilterSidebar` + `JobCards` for interactive browsing over the in-memory job list.

## Recording Outline

1. Create `app/(client)/jobs/page.tsx` as a server component.
2. Introduce `JobsListingWrapper` as the client boundary.
3. Add `JobsProvider` / `JobsContext` for filter state.
4. Build `FilterSidebar` (type, location, search) and `JobCards` (link to `/jobs/[id]`).
5. Demo filtering client-side over mock data.

## Verify in Repo

```bash
git log --oneline --grep="Day 6: Jobs Listing"
# -> 0b43ff9 Day 6: Jobs Listing Page UI
```

- `JobsListingWrapper` wraps children in `JobsProvider`.
- Each job card links to `/jobs/[id]`.
- `context/jobs/JobsProvider.tsx` exposes `search`, `typeFilter`, `locationFilter` setters.

## Notes/Gaps

- Filters are client-side only; URL-based search/filters arrive on Day 12.
- Applicant counts on cards come from repository aggregation (Day 9+), not Day 6 mock shape.

## Next

Lecture 051 — job details page with description and apply form placeholder.
