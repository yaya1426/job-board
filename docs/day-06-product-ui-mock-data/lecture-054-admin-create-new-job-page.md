# Lecture 54 - Admin: Create New Job Page

## Goal

Build the admin "create job" form page at `/dashboard/jobs/new` with all fields needed to describe a listing.

## Implementation Status

**Complete (UI on Day 6).** Form UI exists. On Day 8+ `CreateJobForm` binds to `handleCreateJob` Server Action with zod validation and MongoDB persistence.

## Key Files

- `app/(admin)/dashboard/jobs/new/page.tsx`
- `components/job-management/CreateJobForm.tsx`
- `components/ui/input.tsx`
- `components/ui/textarea.tsx`
- `components/BrutalUI.tsx` (`BrutalSelect`)

## What Was Built

- Create route and multi-field form: title, company, location, type, salary, tags, description, requirements.
- Brutal-design form layout matching admin aesthetic.
- Day 6: client-side submit or local state only; Day 8 adds server persistence.

## Recording Outline

1. Add `app/(admin)/dashboard/jobs/new/page.tsx`.
2. Build `CreateJobForm` with controlled or named inputs.
3. Use shared `Input`, `TextArea`, `BrutalSelect` components.
4. Split requirements (one per line) and tags (comma-separated) — foreshadow Day 8 parsing.
5. Submit navigates back to jobs list (mock append on Day 6).

## Verify in Repo

```bash
git log --oneline --grep="Day 6: Create New Job"
# -> 434db60 Day 6: Create New Job Listing Page
```

- `CreateJobForm` uses `useActionState` + `handleCreateJob` (Day 8 wiring).
- Form fields have `name` attributes matching `CreateJobInput` shape.
- `revalidatePath("/dashboard/jobs")` runs on successful create.

## Notes/Gaps

- When teaching Day 6 in isolation, show UI-only submit; defer Server Action to Day 8.
- Admin auth gate on create action added Day 10 (`role === "ADMIN"`).

## Next

Lecture 055 — edit and delete job UI (partial persistence).
