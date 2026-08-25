# Day 4 - Route Groups and Admin Setup

## Goal

Introduce the admin surface, host-based routing, Next.js `proxy.ts`, and route groups as a way to organize multiple app surfaces inside one codebase.

## Lecture Index

- [Lecture 30 - Day 4 Plan](./lecture-030-day-4-plan.md)
- [Lecture 31 - Next.js Proxy](./lecture-031-nextjs-proxy.md)
- [Lecture 32 - Ship it: Deploy proxy.ts](./lecture-032-ship-proxy-ts.md)
- [Lecture 33 - Configure Admin Sub-domain](./lecture-033-configure-admin-sub-domain.md)
- [Lecture 34 - Route Groups: Why + How?](./lecture-034-route-groups.md)
- [Lecture 35 - Project Milestone: Admin Routes](./lecture-035-admin-routes-milestone.md)
- [Lecture 36 - Ship It: Deploy Checkpoint](./lecture-036-ship-checkpoint.md)
- [Lecture 37 - Recap Day 4](./lecture-037-recap-day-4.md)

## Commit Evidence

Commits found for this day:

- `b7f83c2` - Day4: Add Proxy rules
- `375a025` - Day 4: Catch all rule in proxy
- `9beaf96` - Day 4: add logs for visibility
- `db360db` - Day 4: fix proxy too many redirects (inifinte loop)
- `e6a880a` - Day 4: Fix host equality
- `a225fd3` - Day 4: favicon to execulde
- `1ccf19d` - Day 4: route groups
- `39d2362` - Day 4: Admin Basic Routes

Key files changed:

- `proxy.ts`
- `app/(admin)/dashboard/page.tsx`
- `app/(admin)/dashboard/jobs/page.tsx`
- `app/(admin)/dashboard/applications/page.tsx`
- `app/(admin)/dashboard/applications/[applicationId]/page.tsx`
- `app/(admin)/dashboard/applications/[applicationId]/review/page.tsx`
- `app/(admin)/dashboard/jobs/[jobId]/edit/page.tsx`
- `app/(admin)/dashboard/jobs/[jobId]/page.tsx`
- `app/(admin)/dashboard/jobs/new/page.tsx`

## Final State

By the end of the day, the project had:

- A `proxy.ts` file that routes based on host/subdomain.
- An admin dashboard route group.
- Admin pages for dashboard, jobs, new job, job edit/details, applications, and review routes.
- Route groups separating the public/product surface from the admin surface.

The route group initially used `(app)` for the public side, then was renamed to `(client)` in Day 5.

## Important Problems Solved

- Catch-all proxy rules had to avoid infinite redirects.
- Host equality checks had to be precise.
- Static assets like favicon needed to be excluded from proxy routing.
- Admin URLs needed to work through the admin subdomain without creating a separate app.

## Teaching Narrative

This day explains why a modular monolith can still serve multiple product surfaces:

- Public client app.
- Admin dashboard.
- Same repository.
- Same deployment.
- Different hostnames.

The important concept is that route groups organize code without adding URL path segments, while `proxy.ts` decides which group a hostname should reach.

## Notes

- Authorization was added later (Day 10). Day 4 shipped open admin URLs; today's `proxy.ts` and dashboard layout include JWT role checks.
