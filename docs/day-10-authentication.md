# Day 10 - Authentication

## Goal

Add real authentication using NextAuth.js v4, create identity-only users, hash passwords, support signup/login, expose session `id` and `role`, and replace the temporary application `candidateId` with the authenticated user's id.

## Lectures Covered

This day is represented in project context as Lectures 96-109. Lectures 96-103 are implemented so far.

- Lecture 96 - Installing and Configuring NextAuth.js
- Lecture 97 - Creating User Model and Roles
- Lecture 98 - Signup and Password Hashing
- Lecture 99 - Login Flow and Sessions
- Lecture 100 - Signup Success Redirect Cleanup
- Lecture 101 - Getting Current Logged User
- Lecture 102 - Adding User Profile
- Lecture 103 - Showing Auth State in the Navbar
- Lecture 104 - Protecting Server Actions (planned)
- Lecture 105 - Protecting Admin Pages with Proxy (planned)
- Lecture 106 - Role-Based Access Control (RBAC) (planned)
- Lecture 107 - Admin vs Candidate Access Rules (planned)
- Lecture 108 - Feature Branch for Day 10 (planned)
- Lecture 109 - Recap Day 10 (planned)

## Commit Evidence

No Day 10 commit was found in the current git history.

At the time this doc was written, Day 10 exists as working-tree changes plus `AGENTS.md` context. The implementation is visible through uncommitted files such as:

- `lib/auth.ts`
- `lib/current-user.ts`
- `lib/password.ts`
- `lib/models/user-profile.model.ts`
- `lib/models/user.model.ts`
- `repositories/user-profiles.repository.ts`
- `repositories/users.repository.ts`
- `services/auth/auth.service.ts`
- `services/auth/auth.validation.ts`
- `services/users/users.service.ts`
- `app/actions/auth/auth.action.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `app/(client)/signup/page.tsx`
- `app/(client)/login/page.tsx`
- `components/auth/SignupForm.tsx`
- `components/auth/LoginForm.tsx`
- `components/providers/SessionProvider.tsx`
- `components/navbar/NavbarHeader.tsx`
- `components/navbar/NavbarLinks.tsx`
- `components/navbar/NavbarAccount.tsx`
- `components/navbar/SignOutButton.tsx`
- `components/users/UserNotFound.tsx`
- `hooks/useCurrentUser.ts`
- `types/UserProfile.ts`
- `types/User.ts`
- `types/Roles.ts`
- `types/next-auth.d.ts`

## Final State

Day 10 authentication is in progress. So far it includes:

- NextAuth.js v4 installed and configured.
- JWT session strategy.
- Credentials login.
- Bcrypt password hashing.
- Identity-only `UserModel`.
- Separate `UserProfileModel` for editable candidate profile data.
- `Role` type/const tuple.
- `users.repository.ts` with safe and auth-only lookup functions.
- `user-profiles.repository.ts` with profile lookup/upsert.
- Signup with validation, LinkedIn collection, password match, duplicate email check, bcrypt hashing, and profile creation.
- Login with `CredentialsProvider`.
- NextAuth callbacks that copy `id` and `role` into the token/session.
- Module augmentation for typed `session.user.id` and `session.user.role`.
- `/login` and `/signup` redirect away when already signed in.
- `lib/current-user.ts` server helper for `getCurrentUser()`.
- `hooks/useCurrentUser.ts` client hook for UI-only access to the same user shape.
- `services/users/users.service.ts` server use case for `getCurrentUserProfile()`, returning combined `UserProfile & User` data.
- `JobApplyForm` prefills candidate name/email/LinkedIn from server-provided combined profile data.
- `applyToJob` uses `getCurrentUser().id` instead of a hardcoded candidate id.
- Navbar auth state with a server account component, client active-link component, and client sign-out button.

## Main Files

### NextAuth configuration

- `lib/auth.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `components/providers/SessionProvider.tsx`
- `app/layout.tsx`

`lib/auth.ts` is configuration-only. It defines:

- `session.strategy = "jwt"`
- custom sign-in page: `/login`
- `CredentialsProvider`
- `jwt` callback
- `session` callback

It does not import repositories or password helpers directly. The provider's `authorize` delegates to the auth service.

### User identity

- `lib/models/user.model.ts`
- `types/User.ts`
- `types/Roles.ts`
- `repositories/users.repository.ts`

The user model stores identity only:

- `email`
- `passwordHash`
- `name`
- `role`

Candidate profile fields such as LinkedIn, resume URL, skills, education, experience, phone, and location are intentionally not stored on `User`. They belong on `UserProfile` or future profile-related documents.

### User profile

- `types/UserProfile.ts`
- `lib/models/user-profile.model.ts`
- `repositories/user-profiles.repository.ts`
- `services/users/users.service.ts`
- `components/users/UserNotFound.tsx`

Lecture 102 introduced a separate profile document:

- `User` remains identity/auth data (`email`, `passwordHash`, `name`, `role`).
- `UserProfile` stores editable candidate data (`userId`, `linkedin`, optional `resumeUrl`).
- `userId` references `User` and is unique, giving each user one profile.
- `user-profiles.repository.ts` owns profile persistence and mapping.
- `services/users/users.service.ts` exposes `getCurrentUserProfile()`, which combines `getCurrentUser()` with `findUserProfileByUserId(currentUser.id)`.
- The returned shape is `(UserProfile & User) | null` inside `ServiceResult`, so pages can prefill both identity fields and profile fields from one object.

LinkedIn/profile data is intentionally not stored in the JWT/session. It is product data, not auth data, and should be fetched when needed.

### Password handling

- `lib/password.ts`
- `services/auth/auth.service.ts`

`lib/password.ts` wraps `bcryptjs`:

- `hashPassword(plain)`
- `verifyPassword(plain, hash)`

Services use the wrapper. UI/config files do not call bcrypt directly.

### Signup

- `services/auth/auth.validation.ts`
- `services/auth/auth.service.ts`
- `app/actions/auth/auth.action.ts`
- `components/auth/SignupForm.tsx`
- `app/(client)/signup/page.tsx`

The service:

- validates with zod
- requires `linkedin`
- checks password confirmation
- checks email uniqueness
- hashes the password
- saves a new `CANDIDATE` user
- creates a linked `UserProfile`

Lecture 100 cleaned up success behavior. The current signup form:

- uses a plain client handler
- calls `handleSignup(formData)`
- on success calls `signIn("credentials", { email, password, redirect: false })`
- navigates with `router.push("/")`
- calls `router.refresh()`

This means the user enters the app immediately after signup instead of logging in again.

### Login

- `components/auth/LoginForm.tsx`
- `app/(client)/login/page.tsx`
- `services/auth/auth.service.ts`
- `lib/auth.ts`

`LoginForm` calls:

```ts
signIn("credentials", {
  email,
  password,
  redirect: false,
});
```

`CredentialsProvider.authorize` delegates:

```ts
return verifyCredentials(credentials.email, credentials.password);
```

`verifyCredentials`:

- loads the auth-only user with password hash
- verifies the password
- returns a safe `User | null`

### Session typing

- `types/next-auth.d.ts`

This module augmentation adds:

- `Session.user.id`
- `Session.user.role`
- `User.role`
- `JWT.id`
- `JWT.role`

It uses `extends DefaultUser` and `extends DefaultJWT` so default fields remain available.

### Current logged user

- `lib/current-user.ts`
- `hooks/useCurrentUser.ts`
- `app/(client)/login/page.tsx`
- `app/(client)/signup/page.tsx`
- `components/jobs/JobApplyForm.tsx`
- `services/applications/applications.service.ts`

Lecture 101 added the current-user abstraction:

- Server code calls `getCurrentUser()`, which wraps `getServerSession(authOptions)` and returns the app-level `User | null`.
- Client code can call `useCurrentUser()`, which wraps `useSession()` and returns the same `User | null` shape for UI convenience.
- `/login` and `/signup` use `getCurrentUser()` to redirect signed-in users back to `/`.
- `applyToJob` uses `getCurrentUser()` for the real ownership/security decision and stores `currentUser.id` as `candidateId`.

The important rule: client-side identity is only for UI convenience. Server-side ownership and authorization must come from `getCurrentUser()`.

### Apply form prefill

The apply form prefill now comes from the server page:

```txt
app/(client)/jobs/[id]/page.tsx
  -> getJob(id)
  -> getCurrentUserProfile()
  -> <JobApplyForm userProfile={userProfile} />
```

`JobApplyForm` is still a client component, but it receives simple serializable data from the server page. It uses:

- `userProfile.name` for `candidateName`
- `userProfile.email` for `candidateEmail`
- `userProfile.linkedin` for `candidateLinkedin`

Those submitted values are still snapshots. The actual application owner is still set in `applyToJob` using `getCurrentUser().id`.

### Navbar auth state

- `components/navbar/NavbarHeader.tsx`
- `components/navbar/NavbarLinks.tsx`
- `components/navbar/NavbarAccount.tsx`
- `components/navbar/SignOutButton.tsx`

Lecture 103 started from the visible problem: the navbar was static. A signed-out visitor and a signed-in user saw the same header, so the UI did not reflect the session state.

The final version keeps the navbar mostly server-rendered:

```txt
NavbarHeader (server)
  -> NavbarLinks (client, because it uses usePathname)
  -> NavbarAccount (server, because it calls getCurrentUser)
       -> SignOutButton (client, because it calls signOut on click)
```

The important boundary:

- `NavbarAccount` can read the session server-side through `getCurrentUser()` and render the correct initial UI.
- `NavbarLinks` must be client-side because active route styling depends on `usePathname()`.
- `SignOutButton` must be client-side because `signOut()` is a browser interaction from `next-auth/react`.

For guests, the account area renders `LOGIN` and `SIGN UP`. For signed-in users, it renders the user's name and a sign-out action. Middle navigation moved away from brutal bordered buttons and now uses active underline styling.

This lesson is still UI state, not security. The navbar can hide or show links, but protecting data still belongs in services, Server Actions, route handlers, pages, and proxy/RBAC checks.

## Auth Flow Summary

Login request:

```txt
LoginForm
  -> signIn("credentials")
  -> POST /api/auth/callback/credentials
  -> CredentialsProvider.authorize
  -> verifyCredentials
  -> jwt callback writes id/role
  -> signed JWT cookie is set
```

Session read:

```txt
useSession or getServerSession/getCurrentUser
  -> read/verify cookie
  -> jwt callback runs without user
  -> session callback projects token into session.user
  -> app sees { id, name, email, role }
```

## Architecture Decisions

### NextAuth v4

The project uses NextAuth.js v4 because it is the stable version. v5/Auth.js was avoided because it was still considered beta for this course path.

### JWT sessions

JWT sessions were chosen for simplicity:

- no sessions collection required
- session reads do not hit MongoDB
- `id` and `role` live in the signed token and are projected into `session.user`

### Auth forms use plain client handlers

CRUD forms continue using Server Actions + `useActionState`.

Auth forms use plain client handlers because auth needs chained calls:

- signup: server action -> sign in -> navigate
- login: sign in -> navigate
- sign out: sign out -> redirect

### `lib/auth.ts` is config-only

The initial provider logic was cleaned up so database lookup/password verification live in `services/auth/auth.service.ts`.

This preserves layering:

```txt
NextAuth config
  -> auth service
  -> users repository
  -> UserModel
```

## Teaching Narrative

Day 10 is a sequence:

1. Install and mount NextAuth.
2. Add users and roles.
3. Show why plaintext passwords are dangerous.
4. Add bcrypt hashing.
5. Build login with CredentialsProvider.
6. Explain `authorize`, `jwt`, and `session`.
7. Show `useSession` on the client and `getServerSession` on the server.
8. Clean up signup so success means immediate entry into the app.
9. Replace the temporary application candidate id with the real current user.
10. Add a `UserProfile` document for editable candidate data.
11. Create the profile during signup with LinkedIn.
12. Prefill the apply form with the logged-in user's name, email, and LinkedIn profile URL.
13. Show the auth state in the navbar with a server account area and small client components only where browser APIs are needed.

The key teaching line:

> `authorize` says who you are. `jwt` decides what gets stored in the cookie. `session` decides what the app sees.

## Known Remaining Work

- Protect sensitive Server Actions explicitly.
- Admin authorization is not done. Day 11 should protect the admin subdomain with `proxy.ts` and `getToken`.
- Admin server components/actions should also check `session.user.role === "ADMIN"` for defense in depth.
- `services/candidates/candidates.service.ts` still returns mock `CandidateData`.
- The admin candidates page has not migrated to `User` + `UserProfile` yet.
- Resume upload is not implemented.
