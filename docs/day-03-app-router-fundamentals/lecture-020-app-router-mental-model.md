# Lecture 20 - App Router Mental Model | النموذج الذهني لـ App Router

## Goal

Teach the core App Router idea: the `app/` directory is the router; folders are URL segments; special files (`page`, `layout`, `loading`, etc.) define behavior.

## Implementation Status

Implemented (concepts); Partial (special files like `loading.tsx` not used yet on these routes)

## Key Files (as implemented today)

- `app/` — router root
- `app/layout.tsx` — root layout wrapping every route
- `app/(client)/page.tsx` — `/`
- `app/(client)/jobs/page.tsx` — `/jobs`
- `app/(client)/jobs/[id]/page.tsx` — `/jobs/:id`

## What Was Built

On Day 3, students learned that Next.js resolves URLs by walking the `app/` tree. A `page.tsx` file at a folder level creates a publicly reachable route. Parent `layout.tsx` files wrap child pages. Route groups like `(client)` came later and do not affect the URL.

## Recording Outline

- Open `app/` and explain it is not "just components" — it is the route table.
- Draw URL → folder mapping: `/jobs` → `jobs/page.tsx`, `/jobs/abc` → `jobs/[id]/page.tsx`.
- Name the special files students will use first: `layout.tsx`, `page.tsx`.
- Mention other App Router files (`loading.tsx`, `error.tsx`, `not-found.tsx`) as future tools, not today's work.
- Explain Server Components as the default in App Router pages (no `"use client"` unless needed).
- Show that `(client)` is invisible in the URL — preview Day 4 route groups briefly.
- Contrast "one `pages/` file per route" (Pages Router) with nested folders (App Router).
- Use `wazifa.app` as the concrete product: home, browse jobs, open one job.
- Emphasize: if you know where the folder is, you know the URL (ignoring route groups).
- Transition to explicit comparison with Pages Router in the next lecture.

## Verify in Repo

- `app/layout.tsx` exists and wraps `{children}`.
- `app/(client)/jobs/page.tsx` resolves to `/jobs` on the public host.
- `app/(client)/jobs/[id]/page.tsx` resolves to `/jobs/<id>`.

## Notes / Gaps

- Current job pages call services and render rich components; Day 3 pages were minimal placeholders.
- `app/(admin)/`, `app/(auth)/`, and `app/api/` exist now but are out of scope for Day 3.
- Root layout now includes `SessionProvider` (Day 10); Day 3 root layout was simpler.

## Next

[Lecture 21 - App Router vs Pages Router](./lecture-021-app-router-vs-pages-router.md)
