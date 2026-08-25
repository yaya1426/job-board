# Lecture 46 - Project Milestone: Apply Layout for Admin Pages | معلم تخطيط صفحات الإدارة

## Goal

Ship the admin dashboard shell: sidebar navigation, main content area, and consistent layout across all `/dashboard/*` routes.

## Implementation Status

Implemented (layout + sidebar); Partial (auth guard and users link added later)

## Key Files (as implemented today)

- `app/(admin)/dashboard/layout.tsx`
- `components/navbar/AdminSidebar.tsx`
- All `app/(admin)/dashboard/**/page.tsx` admin routes

## What Was Built

Commit `0e46b8a` ("Day 5: Admin Layout") added the dashboard layout with `AdminSidebar`. Sidebar links cover OVERVIEW, JOB POSTS, APPLICATIONS, and USERS (users link/target added Day 6). Inverted colors (`bg-foreground text-background`) distinguish admin from public shell.

## Recording Outline

- Create `app/(admin)/dashboard/layout.tsx` with flex row: sidebar + main.
- Build `AdminSidebar` with logo, nav links, and sign-out area.
- Map links: `/dashboard`, `/dashboard/jobs`, `/dashboard/applications`.
- Style active route with left border accent (client component + `usePathname`).
- Remove per-page sidebar duplication from admin pages.
- Verify all Day 4 admin routes render inside layout on `dev-admin.wazifa.app`.
- Deploy admin layout milestone.
- Note Day 10 adds `getCurrentUser()` guard in this layout — preview.
- Note USERS nav item lands Day 6 when `users/page.tsx` ships.
- Transition to Day 5 recap.

## Verify in Repo

- `AdminSidebar` lists dashboard, jobs, applications routes.
- `app/(admin)/dashboard/layout.tsx` wraps `{children}` in `<main>`.
- Sidebar persists when navigating between admin pages.

## Notes / Gaps

- Current layout redirects unauthenticated/non-admin users (Day 10) — open on Day 5.
- `AdminSidebar` brand link `href="/admin"` may not match proxy routes — minor inconsistency.
- Resume download route `applications/[id]/resume/route.ts` is Day 11 — no sidebar change needed.

## Next

[Lecture 47 - Recap Day 5](./lecture-047-recap-day-5.md)
