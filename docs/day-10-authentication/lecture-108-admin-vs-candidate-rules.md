# Lecture 108 - Admin vs Candidate Access Rules | صلاحيات الإدارة والمستخدمين

## Status: **Partial** — rules exist in code and proxy; not yet documented as a formal matrix or enforced everywhere

## Goal

Clarify which surfaces and actions belong to candidates vs admins, and honestly list gaps still open in the codebase.

## Access Matrix (As Implemented)

| Surface / Action | Candidate | Admin | Enforcement |
|------------------|-----------|-------|-------------|
| Public job browse | ✅ | ✅ (via public host) | Public |
| Apply to job | ✅ | ✅* | `applyToJob` + auth |
| `/signup` | ✅ public host only | ❌ admin host blocked | `proxy.ts` |
| `/login` | ✅ | ✅ admin host | `(auth)` layout |
| `/dashboard/*` | ❌ | ✅ | `proxy.ts` + layout |
| Create job | ❌ | ✅ | `handleCreateJob` |
| View all applications | ❌ | ✅ | Admin pages (layout gate) |
| Admin candidates page | ❌ | ✅ | Still mock data — Day 12 |

\*Admins can technically apply if they use the public site; no separate rule forbids it yet.

## Host Routing Reminder

```txt
wazifa.app, dev.wazifa.app        -> (client) public app
admin.wazifa.app, dev-admin...    -> dashboard; login only on auth paths
```

Public host `/dashboard` redirects home. Admin host `/` redirects to `/dashboard`.

## Gaps (Teach Honestly)

- No per-route permission map file
- Not every admin Server Action may be protected yet — pattern is `getCurrentUser()` + role check
- Candidates listing still uses mock `CandidateData`
- No admin seeding — manual MongoDB role change for testing
- Profile editing UI may be incomplete beyond signup LinkedIn

## Recording Steps

1. Draw a two-column table on screen (this lecture).
2. Walk through proxy cases for admin host.
3. Show candidate apply path on public host.
4. Attempt admin dashboard as candidate — `/not-authorized`.
5. List TODO protections students should add when new admin mutations appear.

## Key Teaching Lines

> Host + role + action checks together define access. One alone is not enough.

> Document rules before you have fifty routes — we are at the "list in README" stage.

## End State

Students know who can do what today and where enforcement still needs copying the Day 104 pattern.

## Next

Lecture 109 covers the Day 10 feature branch process.
