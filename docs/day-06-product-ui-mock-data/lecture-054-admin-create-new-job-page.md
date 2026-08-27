# Lecture 54 - Admin: Create New Job Page

## Goal

Build the admin "create job" form page at `/dashboard/jobs/new` with all fields needed to describe a listing.

## Implementation Status

**Complete (UI on Day 6).** Form UI exists. On Day 8+ `CreateJobForm` binds to `handleCreateJob` Server Action with zod validation and MongoDB persistence.

## Key Files (as implemented today)

- `app/(admin)/dashboard/jobs/new/page.tsx`
- `components/job-management/CreateJobForm.tsx`
- `components/ui/input.tsx`
- `components/ui/textarea.tsx`
- `components/BrutalUI.tsx` (`BrutalSelect`)

## What Was Built

- Create route and multi-field form: title, company, location, type, salary, tags, description, requirements.
- Brutal-design form layout matching admin aesthetic.
- Day 6: client-side submit or local state only; Day 8 adds server persistence.

## Implementation steps

### Step 1: Create the new job route

Create `app/(admin)/dashboard/jobs/new/page.tsx` with page header and render `CreateJobForm`.

### Step 2: Build CreateJobForm shell

Build `components/job-management/CreateJobForm.tsx` (`"use client"`). On Day 6, use a plain `onSubmit` handler that prevents default and navigates to `/dashboard/jobs` — no persistence.

### Step 3: Add form fields

Add fields with shared components: `Input` (title, company, location, salary, tags), `BrutalSelect` (type), `TextArea` (description, requirements). Give each input a `name` attribute matching the future `CreateJobInput` shape.

### Step 4: Apply brutal form layout

Use brutal-design layout: `brutal-border` form container, grid for paired fields, border-t separator before action buttons.

### Step 5: Add publish and cancel actions

Add PUBLISH JOB and CANCEL buttons. CANCEL calls `router.push("/dashboard/jobs")`.

## Verify
```bash
git log --oneline --grep="Day 6: Create New Job"
# -> 434db60 Day 6: Create New Job Listing Page
- `CreateJobForm` uses `useActionState` + `handleCreateJob` (Day 8 wiring).
- Form fields have `name` attributes matching `CreateJobInput` shape.
- `revalidatePath("/dashboard/jobs")` runs on successful create.

## Outcome

`/dashboard/jobs/new` is a complete create-job form. Day 6 end-state: UI-only submit with navigation. **Current repo:** persists via Server Action + zod + MongoDB (Day 8–9).

## Notes / Gaps

- When teaching Day 6 in isolation, show UI-only submit; defer Server Action to Day 8.
- Admin auth gate on create action added Day 10 (`role === "ADMIN"`).

## Next

[Lecture 55 - Admin: Edit & Delete Job](./lecture-055-admin-edit-delete-job.md)
