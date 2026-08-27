# Lecture 48 - Day (6) Plan

## Goal

Introduce Day 6 as the "make it feel real" milestone: build the full product surface—client and admin—using mock data before any backend persistence.

## Implementation Status

**Complete (historical).** All Day 6 UI pages and components exist. Data sources have since evolved: jobs and applications now come from MongoDB via services (Day 9+); `CandidateData.ts` remains mock.

## Key Files (as implemented today)

- `docs/day-06-product-ui-mock-data/README.md`
- `data/CandidateData.ts` (still live)
- `types/Job.ts`, `types/Application.ts`, `types/Candidate.ts`
- `context/jobs/`, `context/applications/`, `context/users/`

## What Was Built

Day 6 scope preview:

- Client: landing, jobs list, job details with apply placeholder.
- Admin: dashboard, job management, create/edit/delete UI, applications, users.
- Mock data files (`JobsData.ts`, `ApplicationsData.ts`, `CandidateData.ts`) and React context providers as the data bridge.

## Implementation steps

### Step 1: Open the Day 6 lecture index

Inspect `docs/day-06-product-ui-mock-data/README.md` and map the lecture sequence (048–058) to client vs admin routes under `app/(client)/` and `app/(admin)/dashboard/`.

### Step 2: Map lectures to route groups

Map lectures 049–051 to `app/(client)/` routes and 052–057 to `app/(admin)/dashboard/` routes using the README lecture index.

### Step 3: Confirm domain types

Confirm domain types exist in `types/Job.ts`, `types/Application.ts`, and `types/Candidate.ts`. On Day 6 these types back mock arrays and component props.

### Step 4: Review mock data files

Review `data/CandidateData.ts` (still in the repo) and note that `JobsData.ts` / `ApplicationsData.ts` were the Day 6 job/application mocks — removed on Day 9 when MongoDB landed.

### Step 5: Skim context providers

Skim `context/jobs/`, `context/applications/`, and `context/users/` — Day 6 uses these for client-side filter/search state, not as a persistence layer.

## Verify
- Day 6 README lists lectures 48–58 and commit evidence (`1dfd33f` through `6b4175f`).
- Client pages live under `app/(client)/`.
- Admin pages live under `app/(admin)/dashboard/`.
- `data/CandidateData.ts` still exists; `JobsData.ts` and `ApplicationsData.ts` do not (removed Day 9).

## Outcome

You have a clear page map and data strategy for Day 6: full product UI on mock data, context for filters, domain types in `types/`, and known gaps (edit/delete persistence) that motivate Day 8+. **Current repo note:** pages now call services (`getJobs()`, etc.) instead of importing mock files directly — teach Day 6 as the historical UI milestone.

## Notes / Gaps

- The current repo uses service calls on pages, not direct mock imports. Teach Day 6 as the historical UI milestone; Day 8–9 refactored data access.
- Dashboard overview page commit may be bundled with other Day 6 work rather than a standalone commit.

## Next

[Lecture 49 - Home Page](./lecture-049-home-page.md)
