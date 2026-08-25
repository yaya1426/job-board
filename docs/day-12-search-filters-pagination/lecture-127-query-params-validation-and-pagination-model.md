# Lecture 127 - Query Params, Validation, and Pagination Model

## Goal

Introduce URL-as-source-of-truth list state, zod query schemas, and `PaginatedResult<T>` shared types (`types/Pagination.ts`, `services/*/jobs.query.ts`).

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Introduce URL-as-source-of-truth list state, zod query schemas, and `PaginatedResult<T>` shared types (`types/Pagination.ts`, `services/*/jobs.query.ts`).

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

Introduce URL-as-source-of-truth list state, zod query schemas, and `PaginatedResult<T>` shared types (`types/Pagination.ts`, `services/*/jobs.query.ts`).

## Next

Lecture 128 — Paginating Jobs in the Repository (`./lecture-128-paginating-jobs-in-the-repository.md`).
