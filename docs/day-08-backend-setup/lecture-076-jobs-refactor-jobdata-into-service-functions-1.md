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

## Implementation steps
### Step 1

Grep for direct mock imports — list all pages importing `JobsData`:

```bash
rg "JobsData" --glob '!docs/**'
```

### Step 2

Create `services/jobs/jobs.service.ts` and `types/ServiceResult.ts` if not present.

### Step 3

Implement read functions returning `ServiceResult`:

```ts
export async function getJobs(): Promise<ServiceResult<Job[]>> { ... }
export async function getJob(id: string): Promise<ServiceResult<Job>> { ... }
```

On Day 8, import mock array inside service only. On failure, return `{ success: false, errors: { ... } }` — never throw silently.

### Step 4

Update one page first: `app/(client)/jobs/page.tsx` — replace `JobsData` import with `const result = await getJobs()`.

### Step 5

Commit as "jobs service integration (1)" — reads only. Leave `createJob` for Lecture 071.

### Verify

```bash
git log --oneline --grep="jobs service"
# -> 7938a5d / 1a550c3
```

- No page imports `JobsData` directly (file removed Day 9).
- **Current repo:** `getJobs` / `getJob` call `repositories/jobs.repository.ts`.

### End State

Job read paths go through the service layer with uniform `ServiceResult` returns. Pages no longer touch mock data files. Lecture 077 finishes remaining pages.

## Verify
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
