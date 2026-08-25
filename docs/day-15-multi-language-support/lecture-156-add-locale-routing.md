# Lecture 156 - Add Locale Routing

## Goal

Proposed `app/[locale]/(client)` structure or incremental default-locale first step.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Proposed `app/[locale]/(client)` structure or incremental default-locale first step.

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

Proposed `app/[locale]/(client)` structure or incremental default-locale first step.

## Next

Lecture 157 — Create Dictionaries (`./lecture-157-create-dictionaries.md`).
