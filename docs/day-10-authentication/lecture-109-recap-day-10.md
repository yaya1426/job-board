# Lecture 109 - Recap Day (10) | ملخص اليوم العاشر

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
| Supplementary RBAC | Partial — ad-hoc checks |
| Supplementary access rules | Partial — matrix in supplementary doc, not all actions gated |
| Admin seeding | Not implemented |
| Candidates admin page | Still mock data |
| Central permission helper | Future |

## Implementation steps
1. Run full staging demo: signup → auto-login → apply → admin dashboard → proxy block for candidate.
2. Verify JWT session carries `id` + `role` on `session.user`.
3. Open `getCurrentUser()` in `applyToJob` — never trust client-submitted identity.
4. Open `proxy.ts` `getToken()` cases and `(auth)` layout host difference.
5. Call out **supplementary** RBAC and access-matrix notes — ad-hoc checks only, no centralized system.
6. Confirm implemented: NextAuth v4, bcrypt signup, profile at signup, navbar auth, `ApplyAuthPrompt`, admin action protection, proxy + layout gates.
7. List Day 11: resume upload and AI screening.

## Key points
> Day 10 gave the app identity. Day 11 gives applications real resumes and screening.

> Security is layers: proxy, layout, service, action — not navbar hiding alone.

## End State
You should be able to explain the full auth stack and know which Day 10 topics remain partial.

## Next
[Day 11 — Lecture 110: Day (11) Plan](../day-11-file-uploading-ai-screening/lecture-110-day-11-plan.md) introduces file uploading and AI screening.
