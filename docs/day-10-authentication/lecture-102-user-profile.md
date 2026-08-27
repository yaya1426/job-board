# Lecture 102 - Adding User Profile | ملف المستخدم

## Goal
Create `UserProfileModel` for editable candidate data, collect LinkedIn at signup, expose `getCurrentUserProfile()`, and prefill the apply form from server-provided profile data.

## Background
Not everything about a candidate belongs in the login record.

| `User` (identity) | `UserProfile` (product data) |
|-------------------|------------------------------|
| email, passwordHash, name, role | linkedin, resumeUrl (later) |
| Used for auth | Used for forms and display |
| Small JWT/session surface | Fetched when needed |

LinkedIn is **not** stored in the JWT. Session stays `{ id, name, email, role }`.

## Files
- `types/UserProfile.ts`
- `lib/models/user-profile.model.ts`
- `repositories/user-profiles.repository.ts`
- `services/users/users.service.ts` — `getCurrentUserProfile()`
- `services/auth/auth.service.ts` — create profile after signup
- `components/users/UserNotFound.tsx`
- `app/(client)/jobs/[id]/page.tsx`
- `components/jobs/JobApplyForm.tsx`

## Profile Creation at Signup
After `saveNewUser`:

```ts
await saveUserProfile({ userId: user.id, linkedin });
```

## Combined Read Shape
`getCurrentUserProfile()` returns `(UserProfile & User) | null` inside `ServiceResult` so one object prefills name, email, and LinkedIn.

## Job Page Flow
```txt
getJob(id)
getCurrentUserProfile()
  -> if missing, show UserNotFound (later replaced by ApplyAuthPrompt in 104)
  -> else <JobApplyForm userProfile={...} />
```

Form still submits snapshots; `applyToJob` sets `candidateId` from session.

## Implementation steps
1. Create `types/UserProfile.ts` — `id`, `userId`, `linkedin`, optional `resumeUrl`.
2. Create `lib/models/user-profile.model.ts` with unique `userId` ref to `User`.
3. Create `repositories/user-profiles.repository.ts` with `toUserProfile` mapper.
4. Extend signup validation with `linkedin`; after `saveNewUser`, call `saveUserProfile({ userId, linkedin })`.
5. Implement `getCurrentUserProfile()` in `services/users/users.service.ts` — combine `getCurrentUser()` + profile lookup.
6. Update `app/(client)/jobs/[id]/page.tsx` — fetch profile server-side; pass to `JobApplyForm` or show `UserNotFound` (replaced by `ApplyAuthPrompt` in Lecture 104).
7. Do **not** put LinkedIn in JWT/session — profile is fetched when needed.

## Key points
> Session carries identity. Profile carries editable candidate fields.

> Prefill from the server page, not from `useSession()`.

## End State
Signup creates user + profile; apply form prefills LinkedIn and identity fields.

## Next
[Lecture 103 — Showing Auth State in the Navbar](./lecture-103-navbar-auth.md) reflects auth state in the navbar.
