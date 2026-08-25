# Lecture 155 - Decide the Locale Strategy

## Goal

Compare path-based `/en` `/ar` vs subdomain locales; recommend path-based for teaching.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Compare path-based `/en` `/ar` vs subdomain locales; recommend path-based for teaching.

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

Compare path-based `/en` `/ar` vs subdomain locales; recommend path-based for teaching.

## Next

Lecture 156 — Add Locale Routing (`./lecture-156-add-locale-routing.md`).
