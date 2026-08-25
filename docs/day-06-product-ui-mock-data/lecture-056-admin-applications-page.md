# Lecture 57 - Admin: Applications Page

## Goal

Build the admin applications page: status summary, filters, and table of all applications with candidate/job context.

## Implementation Status

**Complete (UI).** Applications listing, filters, and detail links exist. Data from `getApplications()` (MongoDB post–Day 9); Day 6 used `ApplicationsData` mock.

## Key Files

- `app/(admin)/dashboard/applications/page.tsx`
- `components/applications/ApplicationsListingWrapper.tsx`
- `components/applications/ApplicationsTable.tsx`
- `components/applications/ApplicationsFilter.tsx`
- `components/applications/ApplicationsStatusSummary.tsx`
- `context/applications/ApplicationsProvider.tsx`

## What Was Built

- `/dashboard/applications` with header and link to users page.
- Status summary chips (SUBMITTED, REVIEW, SHORTLIST, etc.).
- Filterable applications table with AI score column.
- `ApplicationsProvider` for filter state (status, job, search).

## Recording Outline

1. Introduce `ApplicationsData` mock and `Application` type (snapshot fields).
2. Build `ApplicationsStatusSummary` from status counts.
3. Add `ApplicationsFilter` + context provider.
4. Build `ApplicationsTable` with row link to detail route (detail page may come later).
5. Explain snapshot pattern: application stores candidate/job display fields at apply time.

## Verify in Repo

```bash
git log --oneline --grep="Day 6: Applications"
# -> cf73974 Day 6: Applications Page
```

- `ApplicationsListingWrapper` wraps filter + table in `ApplicationsProvider`.
- Page passes `jobs`, `applications`, `candidates` from services.
- `types/Application.ts` defines status enum and snapshot fields.

## Notes/Gaps

- Application detail route `applications/[applicationId]` added in later days.
- `getCandidates()` still returns mock `CandidateData` for cross-referencing in filters.

## Next

Lecture 057 — admin users page with mock candidate data.
