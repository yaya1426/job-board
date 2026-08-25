# Lecture 145 - JobPosting Structured Data

## Goal

JSON-LD JobPosting on job detail pages aligned with visible content.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

JSON-LD JobPosting on job detail pages aligned with visible content.

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

JSON-LD JobPosting on job detail pages aligned with visible content.

## Next

Lecture 146 — Metadata QA Checklist (`./lecture-146-metadata-qa-checklist.md`).
