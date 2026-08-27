# Lecture 68 - Using Server Functions (Actions)

## Goal
Introduce Server Actions: `"use server"` functions callable from forms and client components for mutations without writing REST endpoints.

## Implementation Status
**Complete.** Job create and job apply actions exist; auth signup action added Day 10.

## Key Files
- `app/actions/jobs/jobs.action.ts`
- `app/actions/applications/applications.action.ts`
- `app/actions/auth/auth.action.ts` (Day 10)

## What Was Built
- `handleCreateJob(prevState, formData)` with `"use server"` directive.
- Action responsibilities: parse FormData, delegate to service, return errors or revalidate.
- `CreateJobState` type matching `useActionState` shape.

## Implementation steps
### Step 1

Create `app/actions/jobs/jobs.action.ts` with `"use server"` at the top.

### Step 2

Define state type and action signature:

```ts
export type CreateJobState = { errors?: Record<string, string[]> } | undefined;

export async function handleCreateJob(
  prevState: CreateJobState,
  formData: FormData,
): Promise<CreateJobState> { ... }
```

### Step 3

Parse `FormData` with `Object.fromEntries(formData)`. Transform multi-value fields before service call:

```ts
tags: (raw.tags as string).split(","),
requirements: (raw.requirements as string).split("\n"),
```

### Step 4

Call `createJob(data)` from `services/jobs/jobs.service.ts`. On failure, return `{ errors: result.errors }`.

### Step 5

On success, call `revalidatePath("/dashboard/jobs", "layout")`. **Current repo** also checks `getCurrentUser()` + `role === "ADMIN"` (Day 10).

### Verify

- File starts with `"use server"`.
- `handleCreateJob` accepts `(prevState, formData)` — Pattern A from AGENTS.md.
- `CreateJobForm` binds `action={formAction}` from `useActionState`.
- FormData field names match `CreateJobInput` shape.

### End State

`handleCreateJob` is a thin Server Action delegating to the service. Create job form can submit without a REST endpoint. Auth guard added Day 10.

## Verify
- `app/actions/jobs/jobs.action.ts` starts with `"use server"`.
- `handleCreateJob` accepts `(prevState, formData)` — Pattern A from AGENTS.md.
- `CreateJobForm` binds `action={formAction}` from `useActionState`.

## Notes/Gaps
- `handleApplyToJob` added with applications flow; may include file upload post–Day 11.
- Auth actions use Pattern B (plain async, no prevState) — explain on Day 10.

## Next
Lecture 069 — Route Handlers (`app/api/.../route.ts`).
