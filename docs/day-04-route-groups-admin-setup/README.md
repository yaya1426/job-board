# Day 4 - Route Groups and Admin Setup

## Goal

Introduce the admin surface, host-based routing, Next.js `proxy.ts`, and route groups as a way to organize multiple app surfaces inside one codebase.

## Lectures Covered

- Lecture 30 - Day 4 Plan
- Lecture 31 - Next.js Proxy
- Lecture 32 - Ship it: Deploy proxy.ts
- Lecture 33 - Configure Admin Sub-domain
- Lecture 34 - Route Groups: Why + How?
- Lecture 35 - Project Milestone: Admin Routes
- Lecture 36 - Ship It: Deploy Checkpoint
- Lecture 37 - Recap Day 4

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

- Authorization is not introduced here. The admin subdomain routes exist, but Day 11 is planned to protect them by role.
