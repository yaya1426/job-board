# Lecture 135 - Empty States and Reset Filters

## Goal

No-results UX across public and admin lists; reset filters control.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

No-results UX across public and admin lists; reset filters control.

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

No-results UX across public and admin lists; reset filters control.

## Next

Lecture 136 — MongoDB Indexes for Search and Filters (`./lecture-136-mongodb-indexes-for-search-and-filters.md`).
