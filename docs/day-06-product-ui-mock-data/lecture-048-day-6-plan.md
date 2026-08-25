# Lecture 48 - Day 6 Plan

## Goal

Introduce Day 6 as the "make it feel real" milestone: build the full product surface—client and admin—using mock data before any backend persistence.

## Implementation Status

**Complete (historical).** All Day 6 UI pages and components exist. Data sources have since evolved: jobs and applications now come from MongoDB via services (Day 9+); `CandidateData.ts` remains mock.

## Key Files

- `docs/day-06-product-ui-mock-data/README.md`
- `data/CandidateData.ts` (still live)
- `types/Job.ts`, `types/Application.ts`, `types/Candidate.ts`
- `context/jobs/`, `context/applications/`, `context/users/`

## What Was Built

Day 6 scope preview:

- Client: landing, jobs list, job details with apply placeholder.
- Admin: dashboard, job management, create/edit/delete UI, applications, users.
- Mock data files (`JobsData.ts`, `ApplicationsData.ts`, `CandidateData.ts`) and React context providers as the data bridge.

## Recording Outline

1. Recap Days 3–5: routing, route groups, layouts, shared UI.
2. State the Day 6 thesis: build the product UI first so backend work has a visible target.
3. Walk the planned page map (client vs admin).
4. Show the mock-data + context pattern students will use today.
5. Preview the lecture sequence (048–058) and expected commits.

## Verify in Repo

- Day 6 README lists lectures 48–58 and commit evidence (`1dfd33f` through `6b4175f`).
- Client pages live under `app/(client)/`.
- Admin pages live under `app/(admin)/dashboard/`.
- `data/CandidateData.ts` still exists; `JobsData.ts` and `ApplicationsData.ts` do not (removed Day 9).

## Notes/Gaps

- Students following the current repo will see service calls on pages, not direct mock imports. Teach Day 6 as the historical UI milestone; Day 8–9 refactored data access.
- Dashboard overview page commit may be bundled with other Day 6 work rather than a standalone commit.

## Next

Lecture 049 — build the public landing page with hero and featured jobs.
