# Lecture 133 - Admin Users Search and Pagination

## Goal

Same query-driven pattern for admin users/candidates listing.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Same query-driven pattern for admin users/candidates listing.

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

Same query-driven pattern for admin users/candidates listing.

## Next

Lecture 134 — Sorting and Default Ordering (`./lecture-134-sorting-and-default-ordering.md`).
