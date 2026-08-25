# Lecture 35 - Project Milestone: Admin Routes | معلم مسارات الإدارة

## Goal

Ship the admin dashboard route tree: overview, jobs list, new job, job edit, applications list, and application detail.

## Implementation Status

Partial (core Day 4 routes Implemented; some original routes removed or added later)

## Key Files (as implemented today)

- `app/(admin)/dashboard/page.tsx` — `/dashboard`
- `app/(admin)/dashboard/jobs/page.tsx` — `/dashboard/jobs`
- `app/(admin)/dashboard/jobs/new/page.tsx` — `/dashboard/jobs/new`
- `app/(admin)/dashboard/jobs/[jobId]/edit/page.tsx` — `/dashboard/jobs/:jobId/edit`
- `app/(admin)/dashboard/applications/page.tsx` — `/dashboard/applications`
- `app/(admin)/dashboard/applications/[applicationId]/page.tsx` — `/dashboard/applications/:id`

## What Was Built

Commit `39d2362` ("Day 4: Admin Basic Routes") added placeholder admin pages. Day 4 originally also included `jobs/[jobId]/page.tsx` (job detail) and `applications/[applicationId]/review/page.tsx` — both removed in later refactors. `users/page.tsx` was added Day 6.

## Recording Outline

- Scaffold `app/(admin)/dashboard/page.tsx` with overview heading.
- Add jobs subtree: list, `new`, `[jobId]/edit` pages.
- Add applications subtree: list and `[applicationId]` detail.
- Use consistent URL prefix `/dashboard` matching proxy redirects.
- Link between admin pages with `Link` (styling comes Day 5).
- Verify on `dev-admin.wazifa.app/dashboard/...` after deploy.
- Walk git show `39d2362` for file list at milestone time.
- Note removed routes: standalone admin job detail and review page — consolidated later.
- Note added later: `users/page.tsx` (Day 6), resume route handler (Day 11).
- Celebrate: two surfaces, one codebase, host decides entry point.

## Verify in Repo

- All listed admin `page.tsx` files exist.
- `dev-admin.wazifa.app/dashboard/jobs` loads (auth may block after Day 10).
- No `app/(admin)/dashboard/jobs/[jobId]/page.tsx` in current tree (removed).
- No `.../review/page.tsx` under applications (removed).

## Notes / Gaps

- Day 4 admin pages were placeholders; current pages use real services and components.
- Admin layout/sidebar (Day 5) and auth gate (Day 10) change the access experience.
- `AdminSidebar` link to `/admin` may not match proxy rules — minor later fix territory.

## Next

[Lecture 36 - Ship It: Deploy Checkpoint](./lecture-036-ship-checkpoint.md)
