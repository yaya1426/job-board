# Lecture 23 - Nested Routes | المسارات المتداخلة

## Goal

Show how folder nesting creates URL nesting: `/jobs` is a child of `/` in the filesystem and in the browser path.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `app/(client)/page.tsx` — `/`
- `app/(client)/jobs/page.tsx` — `/jobs`
- `app/(client)/jobs/[id]/page.tsx` — `/jobs/:id`
- `app/layout.tsx` — ancestor layout for all nested routes

## What Was Built

Students created a `jobs` folder under the app router with its own `page.tsx`, producing the `/jobs` URL without a separate router config file. Nesting `jobs/[id]/page.tsx` adds a second segment. The root layout wraps every nested page automatically.

## Recording Outline

- Draw the folder tree: `app` → `(client)` → `jobs` → `[id]` → `page.tsx`.
- Map each level to a URL segment (skip route group names in the URL).
- Create `app/jobs/page.tsx` (historical path) and confirm `/jobs` works locally.
- Explain that nested routes inherit parent layouts — root layout always applies.
- Contrast flat URLs: there is no `app/jobs.tsx`; the folder + `page.tsx` pattern is required.
- Show `index` behavior: `page.tsx` at a folder is the index for that segment (no `/page` in URL).
- Discuss colocation: related routes live together in one subtree.
- Preview dynamic child `[id]` as the next nesting level.
- Mention admin nested routes as future parallel tree: `dashboard/jobs/...` (Day 4).

## Verify in Repo

- `app/(client)/jobs/page.tsx` exists.
- Browser `/jobs` renders the jobs listing.
- Parent `app/layout.tsx` still wraps the jobs page (shared html/body).

## Notes / Gaps

- Day 3 originally used `app/jobs/` without the `(client)` group.
- Client layout (`app/(client)/layout.tsx`) with navbar/footer is Day 5 — Day 3 pages rendered without that shell.
- Jobs page now uses `JobsListingWrapper` and `getJobs()` service (Day 8+).

## Next

[Lecture 24 - Dynamic Routes](./lecture-024-dynamic-routes.md)
