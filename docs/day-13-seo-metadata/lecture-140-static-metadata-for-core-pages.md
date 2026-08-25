# Lecture 140 - Static Metadata for Core Pages

## Goal

Add static metadata to home, jobs listing, login, signup; consider no-index on auth pages.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Add static metadata to home, jobs listing, login, signup; consider no-index on auth pages.

## Dependencies (what exists today that this will extend)

- Public job routes under `app/(client)/` with generic root metadata only
- No `generateMetadata` on job detail pages yet
- No `app/robots.ts`, `app/sitemap.ts`, or JobPosting JSON-LD
- Day 12 URL-based list pages (when built) become stable SEO targets

## Key Files to Create/Change (planned)

- `app/(client)/page.tsx`, `app/(client)/jobs/page.tsx`, `app/(client)/jobs/[id]/page.tsx`
- `app/robots.ts`, `app/sitemap.ts` (planned)
- Job detail JSON-LD component (planned)
- `app/(auth)/login/page.tsx`, admin layouts for no-index rules

## Recording Outline

Add static metadata to home, jobs listing, login, signup; consider no-index on auth pages.

## Next

Lecture 141 — Dynamic Metadata for Job Details (`./lecture-141-dynamic-metadata-for-job-details.md`).
