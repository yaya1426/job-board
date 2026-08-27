# Lecture 50 - Client: Jobs List Page

## Goal

Build the public jobs listing page with filter sidebar and job cards so candidates can browse all open positions.

## Implementation Status

**Complete.** Jobs list UI and `JobsProvider` context exist. Data now flows from `getJobs()` → `JobsListingWrapper` instead of direct `JobsData` import.

## Key Files (as implemented today)

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

## Implementation steps

### Step 1: Create the jobs list page

Create `app/(client)/jobs/page.tsx` as a server component. On Day 6, import `JobsData` and pass the array to a client wrapper. **Current repo:** call `getJobs()` and return early on error.

### Step 2: Add JobsListingWrapper

Create `components/jobs/JobsListingWrapper.tsx` (`"use client"`) — accept `jobs: Job[]`, wrap children in `JobsProvider`, render `ClientPageHeader`, `FilterSidebar`, and `JobCards` in a sidebar + main grid.

### Step 3: Add JobsProvider context

Create `context/jobs/JobsContext.tsx` (context shape) and `context/jobs/JobsProvider.tsx` — hold `jobs` in `useState`, plus `search`, `typeFilter`, `locationFilter` and their setters.

### Step 4: Build FilterSidebar

Build `components/jobs/FilterSidebar.tsx` — read/write filter state from `JobsContext`; filter options derived from the jobs array (types, locations).

### Step 5: Build JobCards

Build `components/jobs/JobCards.tsx` — apply search/type/location filters client-side, map results to cards linking to `/jobs/[id]`.

## Verify
```bash
git log --oneline --grep="Day 6: Jobs Listing"
# -> 0b43ff9 Day 6: Jobs Listing Page UI
- `JobsListingWrapper` wraps children in `JobsProvider`.
- Each job card links to `/jobs/[id]`.
- `context/jobs/JobsProvider.tsx` exposes `search`, `typeFilter`, `locationFilter` setters.

## Outcome

`/jobs` lists all positions with client-side filters. Day 6 data source was `JobsData`; **current repo** uses `getJobs()` service. Context remains for UI filter state only — not a data cache.

## Notes / Gaps

- Filters are client-side only; URL-based search/filters arrive on Day 12.
- Applicant counts on cards come from repository aggregation (Day 9+), not Day 6 mock shape.

## Next

[Lecture 51 - Client: Job Details Page](./lecture-051-client-job-details-page.md)
