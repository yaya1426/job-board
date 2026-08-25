# Lecture 66 - Day 8 Plan

## Goal

Introduce Day 8 as the backend bridge: move data logic out of components into Server Actions, services, and zod validation — while data may still be mock/static.

## Implementation Status

**Complete.** `services/`, `app/actions/`, `ServiceResult`, and zod validation are established. Repositories added Day 9.

## Key Files

- `docs/day-08-backend-setup/README.md`
- `services/`
- `app/actions/`
- `types/ServiceResult.ts`

## What Was Built

Day 8 roadmap:

- Server Actions for mutations (create job).
- Service layer for reads and business rules.
- `useActionState` for form errors.
- Refactor jobs, applications, candidates off direct mock imports.

## Recording Outline

1. Name Day 6 pain: edit doesn't save, components import mock files.
2. Introduce target architecture diagram (Action → Service → Data).
3. Contrast Route Handlers vs Server Actions (deep dive 068–070).
4. Preview lecture list 066–080 and expected commits.
5. Mention feature branch workflow (Lecture 075).

## Verify in Repo

- Day 8 README lists lectures 66–80 and commits `b4ba20f`, `7938a5d`, `3e60d0e`.
- `services/jobs/`, `services/applications/`, `services/candidates/` exist.

## Notes/Gaps

- Current services call repositories (Day 9+); Day 8 originally read mock arrays inside services.
- Duplicate Day 8 commits in history from branch merges — same work, not two lessons.

## Next

Lecture 067 — mental model for backend in Next.js App Router.
