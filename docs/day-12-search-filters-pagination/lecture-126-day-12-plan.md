# Lecture 126 - Day (12) Plan

## Goal

Introduce the day as the move from "load everything" to query-driven lists across both the public app and admin dashboard.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Introduce the day as the move from "load everything" to query-driven lists across both the public app and admin dashboard.

Show the problem:

```txt
getJobs() -> loads all jobs
getApplications() -> loads all applications
getCandidates() -> still returns static mock data
```

Teaching point: Day 12 is about moving from "load all data" to query-driven lists.

## Dependencies (what exists today that this will extend)

- Auth, MongoDB, repositories/services pattern from Days 8–10
- Full application lists today via `findAllJobs` / `findAllApplications` (no pagination)
- `services/candidates/candidates.service.ts` still returns static `data/CandidateData.ts` mock data
- Day 11 screening fields (`screeningStatus`, optional filters) exist for admin application filters later

## Key Files to Create/Change (planned)

- `types/Pagination.ts` (planned)
- `services/jobs/jobs.query.ts`, `repositories/jobs.repository.ts`
- `app/(client)/jobs/page.tsx`, `components/jobs/JobsFilters.tsx`
- `services/applications/applications.query.ts`, admin applications page + filters
- `services/users/users.query.ts`, migrate off `services/candidates/candidates.service.ts`

## Recording Outline

Introduce the day as the move from "load everything" to query-driven lists across both the public app and admin dashboard.

Show the problem:

```txt
getJobs() -> loads all jobs
getApplications() -> loads all applications
getCandidates() -> still returns static mock data
```

Teaching point: Day 12 is about moving from "load all data" to query-driven lists.

## Next

Lecture 127 — Query Params, Validation, and Pagination Model (`./lecture-127-query-params-validation-and-pagination-model.md`).
