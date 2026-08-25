# Lecture 136 - MongoDB Indexes for Search and Filters

## Goal

Indexes on jobs, applications, and users fields used by Day 12 queries.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Indexes on jobs, applications, and users fields used by Day 12 queries.

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

Indexes on jobs, applications, and users fields used by Day 12 queries.

## Next

Lecture 137 — Feature Branch for Day (12) (`./lecture-137-feature-branch-for-day-12.md`).
