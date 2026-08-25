# Lecture 158 - Translate Public Pages

## Goal

Landing, jobs list/detail, apply prompt, auth labels — candidate-facing first.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Landing, jobs list/detail, apply prompt, auth labels — candidate-facing first.

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

Landing, jobs list/detail, apply prompt, auth labels — candidate-facing first.

## Next

Lecture 159 — RTL Support (`./lecture-159-rtl-support.md`).
