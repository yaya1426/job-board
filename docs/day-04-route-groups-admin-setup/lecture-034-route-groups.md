# Lecture 34 - Route Groups: Why + How? | مجموعات المسارات: لماذا وكيف؟

## Goal

Teach route groups — folders wrapped in parentheses like `(client)` and `(admin)` — that organize code without adding URL segments.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `app/(client)/` — public product pages (`/`, `/jobs`, …)
- `app/(admin)/dashboard/` — admin pages under `/dashboard/...`
- `app/(auth)/` — login/signup (added later; uses `/login`, `/signup` URLs)

## What Was Built

Commit `1ccf19d` introduced route groups. Public pages moved from `app/jobs/...` into a grouped folder (initially `(app)`, renamed to `(client)` in Day 5). Admin pages live under `app/(admin)/dashboard/`. Parentheses strip the group name from the URL: `(client)/jobs/page.tsx` → `/jobs`, not `/client/jobs`.

## Recording Outline

- Explain the problem: two app shells, one `app/` tree, no URL pollution.
- Show folder naming: `(client)`, `(admin)` — parentheses are required.
- Demonstrate URL unchanged after move: `/jobs` still works from `(client)/jobs/page.tsx`.
- Contrast route groups vs route segments: only non-parenthesized folders appear in URLs.
- Show parallel trees: `(client)/layout.tsx` vs `(admin)/dashboard/layout.tsx` (layouts Day 5).
- Mention `(auth)` group as later pattern for login/signup without public navbar.
- Discuss colocation benefits: admin-only components/pages don't mingle with public pages.
- Reference commit `1ccf19d` for the route group introduction.
- Preview admin route files to create next.
- Transition to admin routes milestone.

## Verify in Repo

- `app/(client)/jobs/page.tsx` serves `/jobs` (not `/client/jobs`).
- `app/(admin)/dashboard/page.tsx` serves `/dashboard`.
- No folder literally named `client` or `admin` in the URL path.

## Notes / Gaps

- Historical rename `(app)` → `(client)` happened early Day 5 — mention when students grep git history.
- Route groups can nest; this project keeps admin under `(admin)/dashboard/` for clear `/dashboard` prefix.
- `(auth)` is post-Day 4 but follows the same grouping pattern.

## Next

[Lecture 35 - Project Milestone: Admin Routes](./lecture-035-admin-routes-milestone.md)
