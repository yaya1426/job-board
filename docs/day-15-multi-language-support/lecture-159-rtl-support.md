# Lecture 159 - RTL Support

## Goal

`dir="rtl"` for Arabic, spacing/nav/form alignment review.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

`dir="rtl"` for Arabic, spacing/nav/form alignment review.

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

`dir="rtl"` for Arabic, spacing/nav/form alignment review.

## Next

Lecture 160 — Localized Validation Messages (`./lecture-160-localized-validation-messages.md`).
