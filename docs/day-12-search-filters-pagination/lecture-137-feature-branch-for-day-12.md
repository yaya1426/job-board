# Lecture 137 - Feature Branch for Day (12)

## Goal

Day 12 branch, PR, merge into development workflow.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Day 12 branch, PR, merge into development workflow.

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

Day 12 branch, PR, merge into development workflow.

## Next

Lecture 138 — Recap Day (12) (`./lecture-138-recap-day-12.md`).
