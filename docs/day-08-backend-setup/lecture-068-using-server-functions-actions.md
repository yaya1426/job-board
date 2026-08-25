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

## Recording Outline

1. Explain `"use server"` and file-level vs inline actions.
2. Create `app/actions/jobs/jobs.action.ts`.
3. Parse `FormData` with `Object.fromEntries`.
4. Transform multi-value fields (tags split, requirements split) before service call.
5. Call `revalidatePath("/dashboard/jobs", "layout")` on success.

## Verify in Repo

- `app/actions/jobs/jobs.action.ts` starts with `"use server"`.
- `handleCreateJob` accepts `(prevState, formData)` — Pattern A from AGENTS.md.
- `CreateJobForm` binds `action={formAction}` from `useActionState`.

## Notes/Gaps

- `handleApplyToJob` added with applications flow; may include file upload post–Day 11.
- Auth actions use Pattern B (plain async, no prevState) — explain on Day 10.

## Next

Lecture 069 — Route Handlers (`app/api/.../route.ts`).
