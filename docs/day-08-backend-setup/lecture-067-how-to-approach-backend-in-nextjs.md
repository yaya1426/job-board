# Lecture 67 - How to Approach Backend in Next.js

## Goal
Establish the project backend mental model: server-first data access, thin entry points, services own business logic, validation beside services.

## Implementation Status
**Complete.** Pattern is live across jobs, applications, auth, uploads, screening.

## Key Files
- `AGENTS.md` §4 Architecture Layers
- `services/jobs/jobs.service.ts`
- `app/actions/jobs/jobs.action.ts`

## What Was Built
One-direction flow taught on Day 8 (repositories added Day 9):

```txt
Server Action / Server Component / Route Handler
  → Service (zod + rules)
  → Data source (mock on Day 8; MongoDB Day 9+)
```

Rules introduced:

- Components do not import mock data files directly.
- Services return `ServiceResult<T>`.
- Actions parse `FormData`, call service, `revalidatePath` on success.

## Implementation steps
### Step 1

Read `AGENTS.md` §4 Architecture Layers — one-direction flow and `ServiceResult` contract in `types/ServiceResult.ts`.

### Step 2

Find the anti-pattern: pages that `import { JobsData } from "@/data/..."`. Grep the repo — `JobsData.ts` no longer exists (removed Day 9).

### Step 3

Find the target pattern: `app/(client)/jobs/page.tsx` imports `getJobs` from `@/services/jobs/jobs.service`.

### Step 4

Inspect `services/jobs/jobs.service.ts` and `app/actions/jobs/jobs.action.ts` — action is thin (parse FormData, call service, revalidate); service owns validation and business rules.

### Step 5

State the rules: components never import mock data; services return `ServiceResult<T>`; Server Components call services directly; client components use Server Actions for mutations.

### Verify

- `app/(client)/jobs/page.tsx` imports `getJobs` from service, not `data/`.
- `types/ServiceResult.ts` matches AGENTS.md contract.
- No `JobsData.ts` in `data/` directory.

### End State

Readers have a mental model: server-first data access, thin entry points, services own logic. **Current repo** services call repositories (Day 9+); Day 8 originally read mock arrays inside services.

## Verify
- `app/(client)/jobs/page.tsx` imports `getJobs` from service, not `data/`.
- `AGENTS.md` documents ServiceResult contract.
- No `JobsData.ts` in `data/` directory.

## Notes/Gaps
- Server Components can call services directly; client components cannot — reinforce the boundary.
- `getCurrentUser()` auth checks added later (Day 10) on protected actions.

## Next
Lecture 068 — Server Actions fundamentals.
