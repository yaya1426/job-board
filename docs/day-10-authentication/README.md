# Day (10) Authentication

## Goal

Add real authentication using NextAuth.js v4, create identity-only users, hash passwords, support signup/login, expose session `id` and `role`, and replace the temporary application `candidateId` with the authenticated user's id.

## Lecture Index

- [Lecture 094 - Day (10) Plan](./lecture-094-day-10-plan.md)
- [Lecture 095 - Authentication vs Authorization](./lecture-095-authentication-vs-authorization.md)
- [Lecture 096 - Installing and Configuring NextAuth.js](./lecture-096-nextauth-install.md)
- [Lecture 097 - Creating User Model and Roles](./lecture-097-user-model-roles.md)
- [Lecture 098 - Signup and Password Hashing](./lecture-098-signup-bcrypt.md)
- [Lecture 099 - Login Flow and Sessions](./lecture-099-login-sessions.md)
- [Lecture 100 - Signup Redirect on Success](./lecture-100-signup-redirect-cleanup.md)
- [Lecture 101 - Getting Current Logged User](./lecture-101-current-user.md)
- [Lecture 102 - Adding User Profile](./lecture-102-user-profile.md)
- [Lecture 103 - Showing Auth State in the Navbar](./lecture-103-navbar-auth.md)
- [Lecture 104 - Protecting Server Actions](./lecture-104-protect-server-actions-ux.md)
- [Lecture 105 - Protecting Admin Pages with Proxy](./lecture-105-proxy-admin-protection.md)
- [Lecture 106 - Clean Layout for Auth Pages](./lecture-106-clean-auth-layout.md)
- [Lecture 107 - Feature Branch for Day (10)](./lecture-107-feature-branch-day-10.md)
- [Lecture 108 - Admin Auth State in Sidebar](./lecture-108-admin-auth-state-in-sidebar.md)
- [Lecture 109 - Recap Day (10)](./lecture-109-recap-day-10.md)

## Supplementary

Not separate Udemy lectures — reference material for deeper authorization concepts:

- [Supplementary: Role-Based Access Control (RBAC)](./supplementary/lecture-107-rbac-supplementary.md) — ad-hoc role checks today; no centralized permission helper
- [Supplementary: Admin vs Candidate Access Rules](./supplementary/lecture-108-admin-vs-candidate-supplementary.md) — access matrix and future hardening notes

## Implementation Status Summary

Lectures 094–108 are implemented in the repo. Lecture 109 recap summarizes the milestone; supplementary RBAC notes remain partial.

| Lecture | Topic | Status |
|---------|-------|--------|
| 094 | Day (10) plan | ✅ |
| 095 | Auth vs authorization | ✅ |
| 096 | NextAuth install | ✅ |
| 097 | User model + roles | ✅ |
| 098 | Signup + bcrypt | ✅ |
| 099 | Login + sessions | ✅ |
| 100 | Signup redirect on success | ✅ |
| 101 | Current user | ✅ |
| 102 | User profile | ✅ |
| 103 | Navbar auth | ✅ |
| 104 | Protect Server Actions | ✅ |
| 105 | Proxy admin protection | ✅ |
| 106 | Clean auth layout | ✅ |
| 107 | Feature branch | 📋 process |
| 108 | Admin sidebar auth state | ✅ |
| 109 | Recap | ✅ |

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
- `app/(auth)/layout.tsx`
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(admin)/not-authorized/page.tsx`
- `components/auth/SignupForm.tsx`
- `components/auth/LoginForm.tsx`
- `components/jobs/ApplyAuthPrompt.tsx`
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
- `proxy.ts`

## Final State

Day 10 authentication is implemented through Lecture 108:

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
- `/login` and `/signup` under `app/(auth)/` redirect away when already signed in.
- Dedicated `(auth)` layout: branded split on public host, centered form on admin host.
- No `/signup` on admin host — `proxy.ts` only allows `/login` and `/not-authorized` as public admin paths.
- `lib/current-user.ts` server helper for `getCurrentUser()`.
- `hooks/useCurrentUser.ts` client hook for UI-only access to the same user shape.
- `services/users/users.service.ts` server use case for `getCurrentUserProfile()`, returning combined `UserProfile & User` data.
- `JobApplyForm` prefills candidate name/email/LinkedIn from server-provided combined profile data.
- `applyToJob` uses `getCurrentUser().id` instead of a hardcoded candidate id.
- Navbar auth state with a server account component, client active-link component, and client sign-out button.
- Guest users on the job details page see an apply CTA that sends them to login/signup instead of `USER PROFILE NOT FOUND`.
- Auth forms accept `callbackUrl`, so users can return to the job page or dashboard after login/signup.
- Admin mutations are protected at the Server Action layer, starting with `handleCreateJob`.
- Admin dashboard access is protected in `proxy.ts` using `getToken()` and the JWT `role`.
- `app/(admin)/dashboard/layout.tsx` repeats the admin check as defense in depth.
- `AdminSidebar` receives `currentUser` from the server layout and renders name + sign-out.

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

### Auth pages and layout (Lecture 106)

- `app/(auth)/layout.tsx` — host-aware shell; admin host gets centered form only
- `app/(auth)/login/page.tsx` — server page + `LoginForm`
- `app/(auth)/signup/page.tsx` — server page + `SignupForm`

URLs remain `/login` and `/signup`. Auth pages are **not** under `app/(client)/`.

On admin hosts (`admin.wazifa.app`, `dev-admin.wazifa.app`), `proxy.ts` redirects `/signup` to `/dashboard` because `isAllowedAdminPublicPath` permits only `/login` and `/not-authorized`.

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
- `app/(auth)/signup/page.tsx`

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
- navigates with `router.push(callbackUrl ?? "/")`
- calls `router.refresh()`

This means the user enters the app immediately after signup instead of logging in again.

### Login

- `components/auth/LoginForm.tsx`
- `app/(auth)/login/page.tsx`
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
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
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

### Protecting Server Actions and apply UX

- `components/jobs/ApplyAuthPrompt.tsx`
- `app/(client)/jobs/[id]/page.tsx`
- `components/auth/LoginForm.tsx`
- `components/auth/SignupForm.tsx`
- `app/actions/jobs/jobs.action.ts`
- `components/job-management/CreateJobForm.tsx`

Lecture 104 started from the bad guest experience on the apply page: a logged-out visitor saw `USER PROFILE NOT FOUND`, even though the real issue was that they had not logged in yet.

The page now guides guests instead of showing a confusing profile error:

```txt
JobDetailsPage
  -> getJob(id)
  -> getCurrentUserProfile()
  -> if no usable profile/user, show ApplyAuthPrompt
  -> otherwise show JobApplyForm
```

`ApplyAuthPrompt` links to `/login?callbackUrl=/jobs/[id]` and `/signup?callbackUrl=/jobs/[id]`. The login and signup forms accept `callbackUrl` and navigate back after successful auth, so the user returns to the job page and sees the prefilled apply form.

The security point remains separate from the UX point:

- The page prompt guides honest users.
- `applyToJob` still checks `getCurrentUser()` server-side before saving an application.
- Admin mutations also need their own checks, so `handleCreateJob` now returns `errors.auth` unless the current user exists and has `role === "ADMIN"`.

### Admin page protection with proxy

- `proxy.ts`
- `app/(admin)/not-authorized/page.tsx`
- `app/(admin)/dashboard/layout.tsx`

Lecture 105 protects admin routes before they render. It uses `getToken()` from `next-auth/jwt` because proxy runs before Server Components and should read the signed JWT directly from the request cookies.

The proxy rules:

```txt
public host + /dashboard
  -> redirect to /

admin host + /
  -> redirect to /dashboard

admin host + unknown public path
  -> redirect to /dashboard

admin route + no token
  -> redirect to /login?callbackUrl=/dashboard

admin route + non-admin token
  -> redirect to /not-authorized

admin route + ADMIN token
  -> allow
```

`app/(admin)/dashboard/layout.tsx` also checks `getCurrentUser()` and redirects guests/non-admins. This is defense in depth: proxy blocks early, and the dashboard layout still refuses access if the request reaches it.

For testing, one user role is changed manually in MongoDB from `CANDIDATE` to `ADMIN`. After changing the role, the user must log out and log back in so the JWT receives the updated role.

### Clean auth layout (Lecture 106 — implemented)

- `app/(auth)/layout.tsx`
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`

Auth pages moved out of `(client)` into `(auth)` so they no longer inherit the public navbar/footer.

Public host layout: two-column grid with branding panel + centered form.

Admin host layout: single centered column — no marketing panel, no public chrome.

Signup is not available on admin hosts; `proxy.ts` `isAllowedAdminPublicPath` lists only `/login` and `/not-authorized`.

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

## Reference Guide

Day 10 sequence:

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
14. Improve the logged-out apply experience with a login/signup prompt and callback return.
15. Protect sensitive Server Actions, starting with admin job creation.
16. Protect admin routes with proxy-level JWT role checks and dashboard-layout defense in depth.
17. Move auth pages to `(auth)` with host-aware layout; block signup on admin host.
18. Show admin identity and sign-out in `AdminSidebar` via server-passed `currentUser`.
19. Ship through feature branch workflow and recap the milestone.

Key principle:

> `authorize` says who you are. `jwt` decides what gets stored in the cookie. `session` decides what the app sees.

## Known Remaining Work

- **Supplementary RBAC** — ad-hoc `role === "ADMIN"` checks only; see [supplementary RBAC notes](./supplementary/lecture-107-rbac-supplementary.md).
- **Supplementary access rules** — documented matrix; not every future admin mutation may be gated yet.
- Admin seeding is not implemented. For now, an existing user's role is changed manually in MongoDB for testing.
- `services/candidates/candidates.service.ts` still returns mock `CandidateData`.
- The admin candidates page has not migrated to `User` + `UserProfile` yet.
- Resume upload is not implemented (Day 11).
