# Lecture 143 - Canonical URLs and Domain Strategy

## Goal

Canonicalize public job URLs to `wazifa.app`; keep admin/auth out of index.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Canonicalize public job URLs to `wazifa.app`; keep admin/auth out of index.

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

Canonicalize public job URLs to `wazifa.app`; keep admin/auth out of index.

## Next

Lecture 144 — Robots and Sitemap (`./lecture-144-robots-and-sitemap.md`).
