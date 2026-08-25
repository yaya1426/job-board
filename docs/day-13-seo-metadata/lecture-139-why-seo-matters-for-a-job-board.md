# Lecture 139 - Why SEO Matters for a Job Board

## Goal

Product case: candidates discover jobs via search and shared links; job pages need useful titles/previews and crawl paths.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Product case: candidates discover jobs via search and shared links; job pages need useful titles/previews and crawl paths.

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

Product case: candidates discover jobs via search and shared links; job pages need useful titles/previews and crawl paths.

## Next

Lecture 140 — Static Metadata for Core Pages (`./lecture-140-static-metadata-for-core-pages.md`).
