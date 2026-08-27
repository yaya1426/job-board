# Lecture 30 - Day (4) Plan | خطة اليوم الرابع

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

## Implementation steps

### Step 1: Frame the two-surface problem

Candidates use `wazifa.app`. Admins use `admin.wazifa.app`. Same repo, same deploy — different experiences.

### Step 2: Preview today's file targets

```
proxy.ts                          ← host-based redirects
app/
├── (client)/                     ← public routes (/, /jobs, …)
│   ├── page.tsx
│   └── jobs/...
└── (admin)/dashboard/            ← admin routes (/dashboard/…)
    ├── page.tsx
    ├── jobs/...
    └── applications/...
```

### Step 3: Preview `proxy.ts` role

Runs before any `page.tsx` renders. Reads `host` header + `pathname`, returns redirect or `next()`.

### Step 4: Review lecture sequence

Lecture order: proxy concepts (31) → ship proxy (32) → DNS subdomains (33) → route groups (34) → admin routes (35) → deploy (36) → recap (37).

### Step 5: Name Day 4 scope boundaries

- **In scope:** host redirects (Cases 1–3), route groups, admin placeholder pages.
- **Out of scope:** JWT auth in proxy (Day 10), styled layouts (Day 5), real data (Day 6+).

## Verify
- `proxy.ts` exists at repo root (or will be created in Lecture 32).
- `app/(admin)/dashboard/` and `app/(client)/` folders exist (or will be created Lectures 34–35).
- `docs/day-04-route-groups-admin-setup/README.md` lists lectures 30–37.

## Outcome

Preview Day 4: serve public and admin surfaces from one Next.js app using host-based routing (`proxy.ts`), DNS subdomains, and route groups.

## Notes / Gaps

- Current `proxy.ts` includes Day 10 JWT role checks — distinguish "Day 4 shipped" vs "today's file".
- `dashboard/jobs/[jobId]/page.tsx` and `applications/.../review/page.tsx` were removed later.
- `dashboard/users/page.tsx` was added in Day 6, not Day 4.

## Next

[Lecture 31 - Next.js Proxy](./lecture-031-nextjs-proxy.md)
