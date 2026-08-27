# Lecture 094 - Day (10) Plan

## Goal
Introduce Day 10 as the authentication milestone: real users, hashed passwords, JWT sessions, profile data, navbar auth state, protected Server Actions, and admin route gates — replacing the temporary `candidateId` placeholder from Day 9.

## Implementation Status
**Complete** through Lecture 106 in the repo. Lectures 107–109 cover branch workflow, admin sidebar auth state, and recap.

## Key Files
- `docs/day-10-authentication/README.md`
- `lib/auth.ts`
- `lib/current-user.ts`
- `services/auth/auth.service.ts`
- `app/(auth)/`
- `proxy.ts`

## What Day 10 Delivers
Day 10 plan covers:

- NextAuth.js v4 with JWT sessions (`id` + `role` on `session.user`).
- Identity-only `UserModel` and separate `UserProfileModel`.
- Signup with bcrypt, auto-login on success, and login flows.
- `getCurrentUser()` for server-side ownership and authorization.
- Apply form prefill from combined user + profile data.
- Navbar auth state and guest apply UX (`ApplyAuthPrompt` + `callbackUrl`).
- Server Action protection (`handleCreateJob`, `applyToJob`).
- Admin protection in `proxy.ts` plus dashboard layout defense in depth.
- Clean `(auth)` layout for `/login` and `/signup`.

## Implementation steps
1. Read `docs/day-10-authentication/README.md` and scan lectures 094–109.
2. Confirm Day 9 still uses a placeholder `candidateId` in `applyToJob` — Day 10 replaces it with `getCurrentUser().id`.
3. Map the lecture sequence: install NextAuth → users/roles → signup hash → login/sessions → signup redirect → current user → profile → navbar → action protection → proxy → auth layout → feature branch → admin sidebar auth → recap.
4. Note env vars required for staging: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `MONGO_URI`.
5. Keep `lib/auth.ts` configuration-only; password verification stays in `services/auth/auth.service.ts`.

## Key points
> Authentication answers who the user is. Authorization (roles, proxy gates, action checks) answers what they may do.

> Profile data (LinkedIn, resume) is product data — not session data. Fetch it when needed; do not put it in the JWT.

> UI auth state is guidance. Server Actions, services, and proxy still enforce security.

## Verify
- Day 10 README lists all sixteen published lectures plus supplementary RBAC notes.
- `AGENTS.md` §7b documents the implemented auth stack.

## Next
[Lecture 095 — Authentication vs Authorization](./lecture-095-authentication-vs-authorization.md) clarifies the concepts before installing NextAuth.
