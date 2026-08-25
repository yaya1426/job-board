# Lecture 67 - How to Approach Backend in Next.js

## Goal

Establish the course backend mental model: server-first data access, thin entry points, services own business logic, validation beside services.

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

## Recording Outline

1. Draw the layer diagram; compare to Day 6 context-over-mock pattern.
2. Show a page that used to `import { JobsData }` — anti-pattern.
3. Show the same page calling `getJobs()` — target pattern.
4. Explain why services are async functions, not classes (keep it simple).
5. Tease repositories as the next isolation step (Day 9).

## Verify in Repo

- `app/(client)/jobs/page.tsx` imports `getJobs` from service, not `data/`.
- `AGENTS.md` documents ServiceResult contract.
- No `JobsData.ts` in `data/` directory.

## Notes/Gaps

- Server Components can call services directly; client components cannot — reinforce the boundary.
- `getCurrentUser()` auth checks added later (Day 10) on protected actions.

## Next

Lecture 068 — Server Actions fundamentals.
