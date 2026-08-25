# Lecture 128 - Paginating Jobs in the Repository

## Goal

Add skip/limit/sort/count to `repositories/jobs.repository.ts` and service layer — pagination must happen in MongoDB, not in memory.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Add skip/limit/sort/count to `repositories/jobs.repository.ts` and service layer — pagination must happen in MongoDB, not in memory.

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

Add skip/limit/sort/count to `repositories/jobs.repository.ts` and service layer — pagination must happen in MongoDB, not in memory.

## Next

Lecture 129 — Public Jobs Search UI (`./lecture-129-public-jobs-search-ui.md`).
