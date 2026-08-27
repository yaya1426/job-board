# Lecture 57 - Admin: Users Page

## Goal

Build the admin users page listing candidates with search, stats, and application cross-references — all backed by mock candidate data on Day 6.

## Implementation Status

**Complete (UI).** Users list and search exist. `getCandidates()` still returns static `CandidateData`; real user persistence arrives with auth (Day 10) and profile model.

## Key Files (as implemented today)

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

## Implementation steps

### Step 1: Review Candidate mock data

Review `types/Candidate.ts` and `data/CandidateData.ts` — static mock array of candidates with skills, experience, location, etc. This file **still exists** in the current repo.

### Step 2: Create users page

Create `app/(admin)/dashboard/users/page.tsx` with `AdminPageHeader` (title `USERS`, `+ CREATE USER` linking to `/dashboard/users/new` — route may not exist).

### Step 3: Add UsersProvider

Create `context/users/UsersProvider.tsx` for client-side search state.

### Step 4: Build users listing components

Build `UsersListingWrapper.tsx`, `UsersStats.tsx`, `UsersSearch.tsx`, and `UsersList.tsx`. Pass `jobs`, `applications`, and `candidates` as props from the server page.

### Step 5: Add candidate join helpers

Add `utils/getCandidate.ts` and `utils/getCandidateApplications.ts` to join candidates to their applications for per-user application counts.

## Verify
```bash
git log --oneline --grep="Day 6: Users"
# -> 6b4175f Day 6: Users UI
- `data/CandidateData.ts` exports mock candidates array.
- `getCandidates()` in `services/candidates/candidates.service.ts` still returns `CandidateData`.
- `UsersListingWrapper` receives `jobs`, `applications`, `candidates` props.

## Outcome

`/dashboard/users` lists mock candidates with search and stats. Day 6 imported `CandidateData` directly; **current repo** wraps it in `getCandidates()` service. Real `User` + `UserProfile` persistence arrives Day 10–12.

## Notes / Gaps

- "CREATE USER" button links to `/dashboard/users/new` — route may not exist; UI placeholder.
- Admin users page will migrate to real `User` + `UserProfile` data on Day 12.

## Next

[Lecture 58 - Recap Day (6)](./lecture-058-recap-day-6.md)
