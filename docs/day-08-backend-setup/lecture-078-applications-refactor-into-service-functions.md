# Lecture 78 - Applications: Refactor into Service Functions

## Goal
Move applications read and apply mutation behind `services/applications/applications.service.ts` with zod-validated `applyToJob`.

## Implementation Status
**Complete and extended.** Service includes repository persistence, auth, upload, and screening (Day 11+). Day 8 core: `getApplications`, `getApplication`, `applyToJob` skeleton.

## Key Files
- `services/applications/applications.service.ts`
- `services/applications/applications.validation.ts`
- `app/actions/applications/applications.action.ts`
- `components/jobs/JobApplyForm.tsx`

## What Was Built
- `getApplications()` for admin listing and dashboard.
- `getApplication(id)` for detail views.
- `applyToJob(input)` with `applyToJobSchema`, job lookup, snapshot fields.
- `handleApplyToJob` Server Action + `useActionState` on apply form.

## Implementation steps
### Step 1

Create `services/applications/applications.service.ts` mirroring the jobs pattern.

### Step 2

Create `services/applications/applications.validation.ts` with `applyToJobSchema` for text fields (resume file validation comes Day 11).

### Step 3

Implement `getApplications()` — on Day 8, read from mock `ApplicationsData` inside service. **Current repo:** `findAllApplications` from repository.

### Step 4

Implement `applyToJob(input)`:
- `safeParse` with zod
- Look up job by `jobId`
- Build snapshot fields (`jobTitle`, `jobCompany`, `candidateName`, etc.)
- On Day 8, append to mock array; **current repo:** `saveNewApplication` + auth + upload + screening

### Step 5

Create `app/actions/applications/applications.action.ts` with `handleApplyToJob`. Wire `JobApplyForm` with `useActionState`. On success, `revalidatePath` and redirect.

### Verify

- `getApplications` used by admin dashboard and applications page.
- `applyToJob` validates with `applyToJobSchema.safeParse`.
- No `ApplicationsData.ts` in repo.
- Submitting apply form creates an application visible on `/dashboard/applications`.

### End State

Applications read and apply mutation go through the service layer. **Current repo** includes `getCurrentUser()` auth, resume upload, and AI screening — trim narrative to Day 8 core in this repository historically.

## Verify
- `getApplications` imports `findAllApplications` from repository.
- `applyToJob` validates with `applyToJobSchema.safeParse`.
- No `ApplicationsData.ts` in repo.
- `applications.validation.ts` exists beside service.

## Notes/Gaps
- Current `applyToJob` includes upload + screening — trim narrative for Day 8 recording.
- `getCurrentUser()` required for apply — added Day 10; Day 8 may have used placeholder candidate id.

## Next
Lecture 079 — candidates service (still mock data).
