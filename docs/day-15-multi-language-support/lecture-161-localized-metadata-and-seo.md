# Lecture 161 - Localized Metadata and SEO

## Goal

Extend Day 13 metadata with hreflang/alternate links and Arabic OG copy.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Extend Day 13 metadata with hreflang/alternate links and Arabic OG copy.

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

Extend Day 13 metadata with hreflang/alternate links and Arabic OG copy.

## Next

Lecture 162 — Language Switcher (`./lecture-162-language-switcher.md`).
