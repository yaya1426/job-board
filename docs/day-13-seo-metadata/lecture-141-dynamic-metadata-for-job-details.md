# Lecture 141 - Dynamic Metadata for Job Details

## Goal

Use `generateMetadata` on `app/(client)/jobs/[id]/page.tsx` with title, company, location, description, canonical URL.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Use `generateMetadata` on `app/(client)/jobs/[id]/page.tsx` with title, company, location, description, canonical URL.

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

Use `generateMetadata` on `app/(client)/jobs/[id]/page.tsx` with title, company, location, description, canonical URL.

## Next

Lecture 142 — Open Graph and Social Sharing (`./lecture-142-open-graph-and-social-sharing.md`).
