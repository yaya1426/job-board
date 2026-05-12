# Day 10 - Authentication

## Goal

Add real authentication using NextAuth.js v4, create identity-only users, hash passwords, support signup/login/logout, expose session `id` and `role`, and replace the temporary application `candidateId` with the authenticated user's id.

## Lectures Covered

This day is represented in project context as Lectures 96-100.

- Lecture 96 - Installing and Configuring NextAuth.js
- Lecture 97 - Creating User Model and Roles
- Lecture 98 - Signup and Password Hashing
- Lecture 99 - Login Flow and Sessions
- Lecture 100 - Signup Success Redirect Cleanup

## Commit Evidence

No Day 10 commit was found in the current git history.

At the time this doc was written, Day 10 exists as working-tree changes plus `AGENTS.md` context. The implementation is visible through uncommitted files such as:

- `lib/auth.ts`
- `lib/password.ts`
- `lib/models/user.model.ts`
- `repositories/users.repository.ts`
- `services/auth/auth.service.ts`
- `services/auth/auth.validation.ts`
- `app/actions/auth/auth.action.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `app/(client)/signup/page.tsx`
- `app/(client)/login/page.tsx`
- `components/auth/SignupForm.tsx`
- `components/auth/LoginForm.tsx`
- `components/auth/AuthArea.tsx`
- `components/providers/SessionProvider.tsx`
- `types/User.ts`
- `types/Roles.ts`
- `types/next-auth.d.ts`

## Final State

Day 10 completes the authentication loop:

- NextAuth.js v4 installed and configured.
- JWT session strategy.
- Credentials login.
- Bcrypt password hashing.
- Identity-only `UserModel`.
- `Role` type/const tuple.
- `users.repository.ts` with safe and auth-only lookup functions.
- Signup with validation, password match, duplicate email check, and bcrypt hashing.
- Login with `CredentialsProvider`.
- NextAuth callbacks that copy `id` and `role` into the token/session.
- Module augmentation for typed `session.user.id` and `session.user.role`.
- Navbar auth UI through `useSession`.
- Sign out through `signOut`.
- `/login` and `/signup` redirect away when already signed in.
- `applyToJob` uses `getServerSession(authOptions).user.id` instead of a hardcoded candidate id.

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

Candidate profile fields such as skills, education, experience, phone, and location are intentionally not stored on `User`. They belong to a future profile model.

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
- checks password confirmation
- checks email uniqueness
- hashes the password
- saves a new `CANDIDATE` user

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
useSession or getServerSession
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
9. Replace the temporary application candidate id with the real session user.

The key teaching line:

> `authorize` says who you are. `jwt` decides what gets stored in the cookie. `session` decides what the app sees.

## Known Remaining Work

- Admin authorization is not done. Day 11 should protect the admin subdomain with `proxy.ts` and `getToken`.
- Admin server components/actions should also check `session.user.role === "ADMIN"` for defense in depth.
- `services/candidates/candidates.service.ts` still returns mock `CandidateData`.
- Candidate profiles are not implemented.
- Resume upload is not implemented.
