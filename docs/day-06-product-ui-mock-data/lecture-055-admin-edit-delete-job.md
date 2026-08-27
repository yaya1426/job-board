# Lecture 55 - Admin: Edit & Delete Job

## Goal

Add edit and delete flows for job listings: edit form pre-filled from existing job data, delete confirmation modal.

## Implementation Status

**Partial — UI only.** Edit form renders and navigates away on submit without saving. Delete popup confirms but only `console.log`s the id (TODO in `JobManagementTable`).

## Key Files (as implemented today)

- `app/(admin)/dashboard/jobs/[jobId]/edit/page.tsx`
- `components/job-management/EditJobForm.tsx`
- `components/job-management/JobManagementTable.tsx`
- `components/common/DeletePopup.tsx`

## What Was Built

- Dynamic edit route loading a job by id into `EditJobForm`.
- Local `useState` form prefill from job prop.
- `DeletePopup` modal with confirm/cancel.
- Delete handler stub; edit `handleSubmit` only calls `router.push("/dashboard/jobs")`.

## Implementation steps

### Step 1: Create the edit job route

Create `app/(admin)/dashboard/jobs/[jobId]/edit/page.tsx`. On Day 6, find the job in `JobsData` by `jobId`. **Current repo:** `const result = await getJob(jobId)`; render not-found if `!result.success`.

### Step 2: Build EditJobForm

Build `components/job-management/EditJobForm.tsx` (`"use client"`) — accept `job: Job` prop. Initialize local `useState` form from job fields; join `requirements` with `\n` and `tags` with `", "`.

### Step 3: Mirror create form fields

Mirror create form fields: title, company, location, type (`BrutalSelect`), salary, tags, description, requirements. Use controlled inputs (`value` + `onChange`) — unlike create form's uncontrolled `name` attrs on Day 8.

### Step 4: Stub edit submit handler

Implement `handleSubmit`: `e.preventDefault()` then `navigate.push("/dashboard/jobs")` — **no API call, no state update to mock array**.

### Step 5: Confirm delete popup stub

In `JobManagementTable`, confirm DELETE opens `components/common/DeletePopup.tsx`. `handleDeleteJob` only `console.log`s the id and resets modal state.

## Verify
```bash
git log --oneline --grep="Day 6: Edit"
# -> 247e906 Day 6: Edit & Delete Job Listing
- `EditJobForm` `handleSubmit` prevents default and navigates without API call.
- `JobManagementTable` `handleDeleteJob` contains `// TODO: Delete job from database`.
- `DeletePopup` is a reusable modal in `components/common/`.

## Outcome

Edit and delete **UI is complete** but **persistence is intentionally missing**. The gap motivates Day 8 Server Actions and Day 9 MongoDB. This partial state remains in the current repo.

## Notes / Gaps

- Intentional gap for course narrative: non-persisting edits document the gap before Server Actions + DB.
- No `updateJob` or `deleteJob` service exists yet in the repo.

## Next

[Lecture 56 - Admin: Applications Page](./lecture-056-admin-applications-page.md)
