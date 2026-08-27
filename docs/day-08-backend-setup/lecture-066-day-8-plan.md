# Lecture 66 - Day (8) Plan

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

## Implementation steps
### Step 1

Read `docs/day-08-backend-setup/README.md` — lectures 066–080 and expected commits (`b4ba20f`, `7938a5d`, `3e60d0e`).

### Step 2

Name Day 6 pain points: edit doesn't save, pages import mock files directly, no validation.

### Step 3

Study target architecture in `AGENTS.md` §4:

```txt
Server Action / Server Component → Service (zod) → Data (mock Day 8; MongoDB Day 9+)
```

### Step 4

List lecture sequence: Server Actions (068), Route Handlers (069–070), zod (072), `useActionState` (073), service refactors (076–079).

### Step 5

Create feature branch per Day 7 workflow: `feature/day-8-backend-setup` from `development`.

### Verify

- `services/`, `app/actions/`, `types/ServiceResult.ts` exist in repo.
- Day 8 README lists lectures 66–80.

### End State

Clear roadmap for Day 8: move data logic into services, wire mutations through Server Actions, validate with zod, display errors via `useActionState`. Repositories arrive Day 9.

## Verify
- Day 8 README lists lectures 66–80 and commits `b4ba20f`, `7938a5d`, `3e60d0e`.
- `services/jobs/`, `services/applications/`, `services/candidates/` exist.

## Notes/Gaps
- Current services call repositories (Day 9+); Day 8 originally read mock arrays inside services.
- Duplicate Day 8 commits in history from branch merges — same work, not two lessons.

## Next
Lecture 067 — mental model for backend in Next.js App Router.
