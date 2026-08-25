# Lecture 110 - Recap Day 10 | ملخص اليوم العاشر

## Status: **Partial** — lecture outline here; full narrative and file inventory live in [Day 10 README](./README.md)

## Goal

Close Day 10 by verifying the authentication milestone end-to-end and reinforcing the mental model: install → users → hash → login → session → current user → profile → navbar → action protection → proxy → auth layout.

## Milestone Checklist

Verify on staging:

- [ ] NextAuth v4 mounted at `/api/auth/[...nextauth]`
- [ ] JWT session with `id` and `role` on `session.user`
- [ ] Signup hashes passwords; never stores plaintext
- [ ] Signup auto-signs-in and navigates with `router.refresh()`
- [ ] `getCurrentUser()` used in services/actions for security
- [ ] `UserProfile` created at signup; apply form prefilled server-side
- [ ] Navbar shows guest vs signed-in state
- [ ] `ApplyAuthPrompt` + `callbackUrl` for guests
- [ ] `handleCreateJob` requires `ADMIN`
- [ ] `proxy.ts` blocks non-admin dashboard access
- [ ] `(auth)` layout: branded public login/signup; centered admin login
- [ ] No `/signup` on admin host (proxy redirect)

## Auth Mental Model

```txt
authorize  -> who you are (credentials valid?)
jwt        -> what goes in the cookie (id, role)
session    -> what the app reads (session.user)
```

## Layering Recap

```txt
lib/auth.ts (config only)
  -> services/auth/auth.service.ts
  -> repositories/users.repository.ts
  -> UserModel

getCurrentUser() / getToken() (context-dependent)
  -> never trust client-submitted identity fields
```

## Partial / Future (Call Out)

| Topic | Status |
|-------|--------|
| Lecture 106 auth layout | ✅ Implemented in `app/(auth)/` |
| Lecture 107 RBAC | Partial — ad-hoc checks |
| Lecture 108 access rules | Partial — matrix in lecture, not all actions gated |
| Admin seeding | Not implemented |
| Candidates admin page | Still mock data |
| Central permission helper | Future |

## Recording Steps

1. Run the full demo script from the README "Teaching Narrative" list.
2. Show JWT cookie and session in DevTools briefly.
3. Show one server-side `getCurrentUser()` check in `applyToJob`.
4. Show proxy redirect for candidate on admin host.
5. Show `(auth)` layout difference between public and admin host.
6. Point students to README for commit evidence and file list.
7. Preview Day 11: resume upload and AI screening.

## Key Teaching Lines

> Day 10 gave the app identity. Day 11 gives applications real resumes and screening.

> Security is layers: proxy, layout, service, action — not navbar hiding alone.

## End State

Students can explain the full auth stack and know which Day 10 topics remain partial.

## Next

Day 11 Lecture 110 — File Uploading and AI Screening plan.
