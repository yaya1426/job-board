# Lecture 37 - Recap Day (4) | ملخص اليوم الرابع

## Goal

Summarize host-based routing, proxy debugging lessons, route groups, and the admin route tree — then preview Day 5 layouts and design system.

## Implementation Status

Implemented (Day 4 architecture); Partial (auth, styling, and some admin routes evolved later)

## Key Files (as implemented today)

- `proxy.ts`
- `app/(client)/`
- `app/(admin)/dashboard/`

## What Was Built

Day 4 established the multi-surface architecture: `proxy.ts` steers by hostname, route groups separate public and admin code without URL noise, and admin dashboard routes exist under `/dashboard`. Production debugging covered: redirect loops, host casing, favicon matcher noise.

## Implementation steps

### Step 1: Recap modular monolith

One repo → one deploy → two hostnames (`wazifa.app` + `admin.wazifa.app`).

### Step 2: Recap proxy Cases 1–3 (Day 4 scope)

| Case | Trigger | Redirect |
|------|---------|----------|
| 1 | Public host + `/dashboard` | → `/` |
| 2 | Admin host + `/` | → `/dashboard` |
| 3 | Admin host + non-dashboard | → `/dashboard` |

Day 10 adds JWT auth (Cases 4a–4d) on top of today's file.

### Step 3: Recap route groups

- `(client)` → public routes, invisible in URL.
- `(admin)/dashboard/` → admin routes under `/dashboard`.

### Step 4: Recap admin route map + removed routes

**Current admin pages:**

- `/dashboard` — `dashboard/page.tsx`
- `/dashboard/jobs` — `dashboard/jobs/page.tsx`
- `/dashboard/jobs/new` — `dashboard/jobs/new/page.tsx`
- `/dashboard/jobs/:jobId/edit` — `dashboard/jobs/[jobId]/edit/page.tsx`
- `/dashboard/applications` — `dashboard/applications/page.tsx`
- `/dashboard/applications/:id` — `dashboard/applications/[applicationId]/page.tsx`
- `/dashboard/users` — added Day 6

**Removed since Day 4:**

- `dashboard/jobs/[jobId]/page.tsx` (standalone job detail)
- `dashboard/applications/[applicationId]/review/page.tsx`

### Step 5: Preview Day 5

Tailwind v4, shadcn/ui, brutalist theme, client navbar/footer, admin sidebar.

Point to `docs/day-05-layouts-shared-ui/lecture-038-day-5-plan.md`.

## Verify
- You can explain why `(client)` does not appear in `/jobs` URL.
- Student can draw redirect flow for `admin.wazifa.app/jobs`.
- Lecture index in Day 4 README is complete.
- Lecture index in `docs/day-04-route-groups-admin-setup/README.md` is complete.

## Outcome

Summarize host-based routing, proxy debugging lessons, route groups, and the admin route tree — then preview Day 5 layouts and design system.

## Notes / Gaps

- Authorization story completes Day 10 (`getToken` in proxy + dashboard layout).
- Admin sidebar and public navbar arrive Day 5.
- Candidates listing migration from mock data is Day 12 territory.

## Next

[Lecture 38 - Day (5) Plan](../day-05-layouts-shared-ui/lecture-038-day-5-plan.md)
