# Lecture 56 - Admin: Applications Page

## Goal

Build the admin applications page: status summary, filters, and table of all applications with candidate/job context.

## Implementation Status

**Complete (UI).** Applications listing, filters, and detail links exist. Data from `getApplications()` (MongoDB post–Day 9); Day 6 used `ApplicationsData` mock.

## Key Files (as implemented today)

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

## Implementation steps

### Step 1: Review Application type

Review `types/Application.ts` — status enum (`SUBMITTED`, `REVIEW`, `SHORTLIST`, `INTERVIEW`, `REJECTED`) and snapshot fields (`candidateName`, `jobTitle`, `aiScore`, etc.). On Day 6, seed from `ApplicationsData`.

### Step 2: Create applications page

Create `app/(admin)/dashboard/applications/page.tsx` with `AdminPageHeader` (title `APPLICATIONS`, link to `/dashboard/users`).

### Step 3: Build ApplicationsStatusSummary

Build `components/applications/ApplicationsStatusSummary.tsx` — count applications per status from the array.

### Step 4: Add ApplicationsProvider wrapper

Create `context/applications/ApplicationsProvider.tsx` and `ApplicationsListingWrapper.tsx` — hold filter state (status, job, search).

### Step 5: Build filter and table components

Build `ApplicationsFilter.tsx` and `ApplicationsTable.tsx` — filterable table with AI score column and snapshot display fields. Explain snapshot pattern: application stores display data at apply time.

## Verify
```bash
git log --oneline --grep="Day 6: Applications"
# -> cf73974 Day 6: Applications Page
- `ApplicationsListingWrapper` wraps filter + table in `ApplicationsProvider`.
- Page passes `jobs`, `applications`, `candidates` from services.
- `types/Application.ts` defines status enum and snapshot fields.

## Outcome

`/dashboard/applications` shows status summary, filters, and table. Day 6 used `ApplicationsData` mock; **current repo** fetches applications from MongoDB. Application detail route added in later days.

## Notes / Gaps

- Application detail route `applications/[applicationId]` added in later days.
- `getCandidates()` still returns mock `CandidateData` for cross-referencing in filters.

## Next

[Lecture 57 - Admin: Users Page](./lecture-057-admin-users-page.md)
