# Lecture 130 - Admin Applications Filtering and Pagination

## Goal

Design admin applications query: status, job, screening status, candidate search, pagination in repository/service/page.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Design admin applications query: status, job, screening status, candidate search, pagination in repository/service/page.

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

Design admin applications query: status, job, screening status, candidate search, pagination in repository/service/page.

## Next

Lecture 131 — Admin Applications Filter UI (`./lecture-131-admin-applications-filter-ui.md`).
