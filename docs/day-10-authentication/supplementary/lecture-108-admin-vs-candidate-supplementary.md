# Lecture 108 - Supplementary: Admin vs Candidate Access Rules | صلاحيات الإدارة والمستخدمين

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

## Implementation steps
> **Status: Partial** — rules exist in code and proxy; not yet a formal permission matrix enforced everywhere.

1. Document the access matrix (as implemented):

| Surface / Action | Candidate | Admin | Enforcement |
|------------------|-----------|-------|-------------|
| Public job browse | ✅ | ✅ | Public |
| Apply to job | ✅ | ✅* | `applyToJob` + auth |
| `/signup` | ✅ public only | ❌ admin blocked | `proxy.ts` Case 3 |
| `/dashboard/*` | ❌ | ✅ | `proxy.ts` + layout |
| Create job | ❌ | ✅ | `handleCreateJob` |

2. Trace `proxy.ts` Cases 1–5 with actual host constants.
3. Open candidate blocked at `admin.wazifa.app/dashboard` → `/not-authorized`.
4. List honest gaps: no admin seeding, candidates page still mock, not every admin mutation may be gated yet.
5. When adding new admin mutations, copy the Day 104 `getCurrentUser()` + role check pattern.

## Key points
> Host + role + action checks together define access. One alone is not enough.

> Document rules before you have fifty routes — we are at the "list in README" stage.

## End State
Students know who can do what today and where enforcement still needs copying the Day 104 pattern.

## Next
Lecture 109 covers the Day 10 feature branch process.
