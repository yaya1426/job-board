# Lecture 76 - Jobs: Refactor JobData into Service Functions (1)

## Goal

First jobs refactor: extract read logic from `JobsData` / inline imports into `services/jobs/jobs.service.ts` with `getJobs` and `getJob`.

## Implementation Status

**Complete and evolved.** Service now calls `repositories/jobs.repository.ts` (Day 9). Day 8 step isolated mock access inside service functions.

## Key Files

- `services/jobs/jobs.service.ts` — `getJobs`, `getJob`, `createJob`
- `types/ServiceResult.ts`
- `repositories/jobs.repository.ts` (Day 9+)

## What Was Built

- `getJobs(): Promise<ServiceResult<Job[]>>`
- `getJob(id): Promise<ServiceResult<Job>>`
- Uniform success/error return instead of throwing or returning `undefined` silently.
- Mock array import moved from pages into service (Day 8); repository swap (Day 9).

## Recording Outline

1. Find all `import … JobsData` in pages — list refactor targets.
2. Create `services/jobs/jobs.service.ts`.
3. Implement `getJobs` returning `ServiceResult`.
4. Update one page (`jobs/page.tsx`) to call service.
5. Commit as "jobs service integration (1)" — reads only.

## Verify in Repo

```bash
git log --oneline --grep="jobs service"
# -> 7938a5d / 1a550c3 Day 8: jobs service integration
```

- No page imports `JobsData` (file removed).
- `getJobs` / `getJob` import from `repositories/jobs.repository`.
- Both return `ServiceResult` shape.

## Notes/Gaps

- Lecture split across 076–077: this lecture focuses on read paths.
- Error messages like `{ jobs: ["Jobs not found"] }` are coarse — acceptable for course stage.

## Next

Lecture 077 — refactor remaining job-consuming components and pages.
