# Lecture 160 - Localized Validation Messages

## Goal

Plan for zod messages via keys or locale-aware schema builders at service boundary.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Plan for zod messages via keys or locale-aware schema builders at service boundary.

## Dependencies (what exists today that this will extend)

- UI strings hardcoded in English across client/admin components
- Zod validation messages English-only in `services/*/validation.ts`
- No locale routing (`/en`, `/ar`) or dictionaries
- Day 13 metadata work will need locale-aware titles when i18n lands

## Key Files to Create/Change (planned)

- `app/[locale]/...` or incremental locale wrapper (planned)
- `dictionaries/en.ts`, `dictionaries/ar.ts`, `lib/i18n.ts`
- Public pages, auth forms, validation message mapping
- Language switcher component (planned)

## Recording Outline

Plan for zod messages via keys or locale-aware schema builders at service boundary.

## Next

Lecture 161 — Localized Metadata and SEO (`./lecture-161-localized-metadata-and-seo.md`).
