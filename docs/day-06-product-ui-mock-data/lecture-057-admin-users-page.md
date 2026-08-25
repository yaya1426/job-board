# Lecture 57 - Admin: Users Page

## Goal

Build the admin users page listing candidates with search, stats, and application cross-references — all backed by mock candidate data on Day 6.

## Implementation Status

**Complete (UI).** Users list and search exist. `getCandidates()` still returns static `CandidateData`; real user persistence arrives with auth (Day 10) and profile model.

## Key Files

- `app/(admin)/dashboard/users/page.tsx`
- `components/users/UsersListingWrapper.tsx`
- `components/users/UsersList.tsx`
- `components/users/UsersSearch.tsx`
- `components/users/UsersStats.tsx`
- `data/CandidateData.ts`
- `utils/getCandidate.ts`
- `utils/getCandidateApplications.ts`
- `context/users/UsersProvider.tsx`

## What Was Built

- `/dashboard/users` with candidate count subtitle.
- `UsersStats`, `UsersSearch`, and `UsersList` components.
- `UsersProvider` for client-side search state.
- Helper utils joining candidates to their applications.

## Recording Outline

1. Review `Candidate` type and `CandidateData` array.
2. Build users page shell with `AdminPageHeader`.
3. Add stats row (total users, active, etc.).
4. Implement search filtering via context.
5. Show per-candidate application count using `getCandidateApplications`.

## Verify in Repo

```bash
git log --oneline --grep="Day 6: Users"
# -> 6b4175f Day 6: Users UI
```

- `data/CandidateData.ts` exports mock candidates array.
- `getCandidates()` in `services/candidates/candidates.service.ts` still returns `CandidateData`.
- `UsersListingWrapper` receives `jobs`, `applications`, `candidates` props.

## Notes/Gaps

- "CREATE USER" button links to `/dashboard/users/new` — route may not exist; UI placeholder.
- Admin users page will migrate to real `User` + `UserProfile` data on Day 12.

## Next

Lecture 058 — Day 6 recap.
