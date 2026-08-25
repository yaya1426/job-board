# Lecture 144 - Robots and Sitemap

## Goal

Add `app/robots.ts` and `app/sitemap.ts` for public routes; exclude dashboard/auth/api.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Add `app/robots.ts` and `app/sitemap.ts` for public routes; exclude dashboard/auth/api.

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

Add `app/robots.ts` and `app/sitemap.ts` for public routes; exclude dashboard/auth/api.

## Next

Lecture 145 — JobPosting Structured Data (`./lecture-145-jobposting-structured-data.md`).
