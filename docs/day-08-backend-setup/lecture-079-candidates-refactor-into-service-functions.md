# Lecture 79 - Candidates: Refactor into Service Functions

## Goal

Wrap `CandidateData` mock behind `getCandidates()` service so admin users/applications pages stop importing the data file directly.

## Implementation Status

**Complete (mock persists).** `getCandidates()` still returns `CandidateData`; `dbConnect()` called but TODO remains for real persistence.

## Key Files

- `services/candidates/candidates.service.ts`
- `data/CandidateData.ts`
- `app/(admin)/dashboard/users/page.tsx`
- `app/(admin)/dashboard/applications/page.tsx`
- `utils/getCandidate.ts`
- `utils/getCandidateApplications.ts`

## What Was Built

```ts
export async function getCandidates(): Promise<ServiceResult<Candidate[]>> {
  await dbConnect();
  // TODO: Database will solve this
  return { success: true, data: CandidateData };
}
```

- Pages call `getCandidates()` alongside jobs and applications services.
- Utils remain for joining candidates to applications in UI.

## Recording Outline

1. Grep for direct `CandidateData` imports in pages.
2. Create `services/candidates/candidates.service.ts`.
3. Return `ServiceResult<Candidate[]>` for consistency.
4. Update users and applications admin pages.
5. Acknowledge mock explicitly — same service signature will swap data source on Day 12.

## Verify in Repo

```bash
git log --oneline --grep="candidate data from service"
# -> 3e60d0e / f4d8256 Day 8: candidate data from service function
```

- `getCandidates` in `services/candidates/candidates.service.ts`.
- `CandidateData.ts` still in `data/`.
- Admin pages import `getCandidates` from service.

## Notes/Gaps

- `await dbConnect()` anticipates Day 9 but still returns static array — intentional teaser.
- Real candidates migrate to `User` + `UserProfile` on Day 12 admin listing work.

## Next

Lecture 080 — Day 8 recap.
