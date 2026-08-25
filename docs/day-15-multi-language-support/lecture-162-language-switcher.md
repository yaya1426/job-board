# Lecture 162 - Language Switcher

## Goal

Switch locale while preserving page + important query params.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Switch locale while preserving page + important query params.

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

Switch locale while preserving page + important query params.

## Next

Day recap and course continuation.
