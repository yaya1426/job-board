# Lecture 24 - Dynamic Routes | المسارات الديناميكية

## Goal

Introduce dynamic URL segments with bracket folders (`[id]`) so one page component can render many job detail URLs.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `app/(client)/jobs/[id]/page.tsx` — dynamic job details route
- `app/(client)/jobs/page.tsx` — listing that links into dynamic routes

## What Was Built

Students added `app/jobs/[id]/page.tsx` (now `app/(client)/jobs/[id]/page.tsx`). The `[id]` folder name creates a dynamic segment: `/jobs/abc123` and `/jobs/xyz789` both hit the same page file with different param values.

## Recording Outline

- Explain static vs dynamic segments: `jobs` is static; `[id]` is dynamic.
- Create or open the `[id]` folder and `page.tsx` inside it.
- Show example URLs: `/jobs/senior-engineer-id`, `/jobs/designer-role-id`.
- Clarify naming: the folder is `[id]`; the param key in code is `id`.
- Mention other dynamic patterns briefly: `[...slug]` catch-all, `[[...slug]]` optional catch-all (not used yet).
- Connect to the product: every job posting needs its own shareable URL.
- Show that only one `page.tsx` scales to N jobs — no per-job files.
- Preview reading `params` in the next lecture (Next.js 15+ async `params` Promise).
- Optional: show admin dynamic routes for contrast — `app/(admin)/dashboard/jobs/[jobId]/edit/page.tsx` uses `[jobId]` (Day 4+).

## Verify in Repo

- Folder `app/(client)/jobs/[id]/` exists with `page.tsx`.
- Navigating to `/jobs/<valid-id>` renders job details (with DB-backed data today).
- Invalid id shows `JobNotFound` component (added in later days; Day 3 may have been simpler).

## Notes / Gaps

- Admin uses `[jobId]` and `[applicationId]` naming — different param names, same dynamic-route mechanic.
- `jobs/[jobId]/page.tsx` under admin was removed in a later refactor; edit route remains.
- Current page is much richer (apply form, auth prompt) than Day 3 placeholder.

## Next

[Lecture 25 - Route Params](./lecture-025-route-params.md)
