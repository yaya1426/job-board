# Lecture 53 - Admin: Jobs Management Page

## Goal

Build the admin jobs management page: a table of all job postings with actions to create, edit, and delete.

## Implementation Status

**Complete (UI).** Table and navigation exist. Delete still logs to console (TODO). Edit navigates to form that does not persist (Lecture 055).

## Key Files (as implemented today)

- `app/(admin)/dashboard/jobs/page.tsx`
- `components/job-management/JobManagementTable.tsx`
- `components/common/AdminPageHeader.tsx`

## What Was Built

- `/dashboard/jobs` route with page header ("JOB POSTS") and create button linking to `/dashboard/jobs/new`.
- `JobManagementTable` — columns for title, company, type, applicants, posted date, actions.
- Edit and delete buttons per row (client-side handlers).

## Implementation steps

### Step 1: Create the jobs management page

Create `app/(admin)/dashboard/jobs/page.tsx`. On Day 6, import `JobsData`. **Current repo:** `const result = await getJobs()`.

### Step 2: Add AdminPageHeader

Reuse `components/common/AdminPageHeader.tsx` with title `JOB POSTS`, subtitle showing count, and `actionButtonLink="/dashboard/jobs/new"` with `+ CREATE JOB` CTA.

### Step 3: Build JobManagementTable

Build `components/job-management/JobManagementTable.tsx` (`"use client"`) — table columns: title, company, type, applicants, posted, actions.

### Step 4: Wire edit navigation

Wire EDIT button: `navigate.push(\`/dashboard/jobs/${jobId}/edit\`)`.

### Step 5: Wire delete confirmation stub

Wire DELETE button: open `DeletePopup` via local state (`isDeletePopupOpen`, `jobIdToDelete`). `handleDeleteJob` logs id and closes modal — persistence deferred to Day 8+.

## Verify
- `JobManagementTable` imported in `app/(admin)/dashboard/jobs/page.tsx`.
- `onEditJob` pushes to `/dashboard/jobs/${jobId}/edit`.
- `onDeleteJob` opens `DeletePopup`; `handleDeleteJob` has `// TODO: Delete job from database`.
- Page calls `getJobs()` for current data.

## Outcome

`/dashboard/jobs` lists all jobs with edit/delete UI. Delete is a stub; edit navigates to a form that does not persist (Lecture 055). **Current repo** fetches jobs via `getJobs()` service.

## Notes / Gaps

- Applicant column uses aggregation from repository (`applicants` count), not Day 6 mock field.
- No dedicated Day 6 commit message for this page; table likely landed with create/edit lectures.

## Next

[Lecture 54 - Admin: Create New Job Page](./lecture-054-admin-create-new-job-page.md)
