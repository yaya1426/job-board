# Lecture 53 - Admin: Jobs Management Page

## Goal

Build the admin jobs management page: a table of all job postings with actions to create, edit, and delete.

## Implementation Status

**Complete (UI).** Table and navigation exist. Delete still logs to console (TODO). Edit navigates to form that does not persist (Lecture 055).

## Key Files

- `app/(admin)/dashboard/jobs/page.tsx`
- `components/job-management/JobManagementTable.tsx`
- `components/common/AdminPageHeader.tsx`

## What Was Built

- `/dashboard/jobs` route with page header ("JOB POSTS") and create button linking to `/dashboard/jobs/new`.
- `JobManagementTable` — columns for title, company, type, applicants, posted date, actions.
- Edit and delete buttons per row (client-side handlers).

## Recording Outline

1. Create `app/(admin)/dashboard/jobs/page.tsx`.
2. Reuse `AdminPageHeader` with "+ CREATE JOB" CTA.
3. Build table component mapping over jobs array.
4. Wire edit → `/dashboard/jobs/[jobId]/edit`.
5. Wire delete → open `DeletePopup` (persistence deferred).

## Verify in Repo

- `JobManagementTable` imported in `app/(admin)/dashboard/jobs/page.tsx`.
- `onEditJob` pushes to `/dashboard/jobs/${jobId}/edit`.
- `onDeleteJob` opens `DeletePopup`; `handleDeleteJob` has `// TODO: Delete job from database`.
- Page calls `getJobs()` for current data.

## Notes/Gaps

- Applicant column uses aggregation from repository (`applicants` count), not Day 6 mock field.
- No dedicated Day 6 commit message for this page; table likely landed with create/edit lectures.

## Next

Lecture 054 — create new job form page.
