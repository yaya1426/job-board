# Lecture 55 - Admin: Edit & Delete Job

## Goal

Add edit and delete flows for job listings: edit form pre-filled from existing job data, delete confirmation modal.

## Implementation Status

**Partial — UI only.** Edit form renders and navigates away on submit without saving. Delete popup confirms but only `console.log`s the id (TODO in `JobManagementTable`).

## Key Files

- `app/(admin)/dashboard/jobs/[jobId]/edit/page.tsx`
- `components/job-management/EditJobForm.tsx`
- `components/job-management/JobManagementTable.tsx`
- `components/common/DeletePopup.tsx`

## What Was Built

- Dynamic edit route loading a job by id into `EditJobForm`.
- Local `useState` form prefill from job prop.
- `DeletePopup` modal with confirm/cancel.
- Delete handler stub; edit `handleSubmit` only calls `router.push("/dashboard/jobs")`.

## Recording Outline

1. Create edit page fetching job by `jobId` param.
2. Build `EditJobForm` mirroring create form fields.
3. Prefill state from job on mount.
4. Add `DeletePopup` to jobs table.
5. Explicitly label edit/delete as **UI complete, persistence TODO** — motivates Day 8–9 backend work.

## Verify in Repo

```bash
git log --oneline --grep="Day 6: Edit"
# -> 247e906 Day 6: Edit & Delete Job Listing
```

- `EditJobForm` `handleSubmit` prevents default and navigates without API call.
- `JobManagementTable` `handleDeleteJob` contains `// TODO: Delete job from database`.
- `DeletePopup` is a reusable modal in `components/common/`.

## Notes/Gaps

- Intentional gap for course narrative: students feel the pain of non-persisting edits before Server Actions + DB.
- No `updateJob` or `deleteJob` service exists yet in the repo.

## Next

Lecture 056 — admin applications dashboard.
