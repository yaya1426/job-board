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

## Recording Outline

1. Create `applications.service.ts` mirroring jobs pattern.
2. Define `applyToJobSchema` for text fields (resume file later).
3. Implement `applyToJob` — append to mock array on Day 8.
4. Wire `JobApplyForm` to `handleApplyToJob`.
5. Verify application appears on admin applications page.

## Verify in Repo

- `getApplications` imports `findAllApplications` from repository.
- `applyToJob` validates with `applyToJobSchema.safeParse`.
- No `ApplicationsData.ts` in repo.
- `applications.validation.ts` exists beside service.

## Notes/Gaps

- Current `applyToJob` includes upload + screening — trim narrative for Day 8 recording.
- `getCurrentUser()` required for apply — added Day 10; Day 8 may have used placeholder candidate id.

## Next

Lecture 079 — candidates service (still mock data).
