# Lecture 30 - Day 4 Plan | خطة اليوم الرابع

## Goal

Preview Day 4: serve public and admin surfaces from one Next.js app using host-based routing (`proxy.ts`), DNS subdomains, and route groups.

## Implementation Status

Planned (day opener; implementation in Lectures 31–36)

## Key Files (as implemented today)

- `proxy.ts` — host-based routing and admin auth gate (auth rules added Day 10)
- `app/(client)/` — public product routes
- `app/(admin)/dashboard/` — admin dashboard routes
- `app/(admin)/not-authorized/page.tsx` — non-admin friendly block (Day 10)

## What Was Built

Day 4 introduces the modular monolith pattern for `wazifa.app`: one deployment, two hostnames (`wazifa.app` vs `admin.wazifa.app`), route groups that organize code without changing URLs, and a proxy layer that steers traffic before pages render.

## Recording Outline

- Frame the problem: candidates and admins need different experiences, not one mixed navbar.
- Show the target architecture: same repo, same deploy, different hosts.
- Preview `proxy.ts` as Next.js 16's replacement for `middleware.ts`.
- Preview route groups `(client)` and `(admin)` — parentheses omitted from URLs.
- List admin routes to build: dashboard overview, jobs, applications, new/edit job.
- Name Day 4 commits: proxy fixes (`b7f83c2`, redirect loop fixes, favicon exclusion) and route groups (`1ccf19d`, `39d2362`).
- Note authorization is **not** Day 4 — admin URLs exist openly until Day 10 proxy/layout protection.
- Preview DNS: `admin.wazifa.app` and `dev-admin.wazifa.app` on Cloudflare.
- Walk the lecture sequence 31–37.
- Transition to Next.js Proxy concepts.

## Verify in Repo

- `proxy.ts` exists at repo root.
- `app/(admin)/dashboard/` and `app/(client)/` folders exist.
- `docs/day-04-route-groups-admin-setup/README.md` lists lectures 30–37.

## Notes / Gaps

- Current `proxy.ts` includes Day 10 JWT role checks — distinguish "Day 4 shipped" vs "today's file".
- `dashboard/jobs/[jobId]/page.tsx` and `applications/.../review/page.tsx` were removed later.
- `dashboard/users/page.tsx` was added in Day 6, not Day 4.

## Next

[Lecture 31 - Next.js Proxy](./lecture-031-nextjs-proxy.md)
