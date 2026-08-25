# Lecture 148 - Review Rendering Strategy

## Goal

Revisit `force-dynamic` / `revalidate = 0`; when to keep vs when public pages might revalidate later.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Revisit `force-dynamic` / `revalidate = 0`; when to keep vs when public pages might revalidate later.

## Dependencies (what exists today that this will extend)

- Route group layouts export `force-dynamic` + `revalidate = 0` (Mongoose correctness)
- Day 12 paginated repository methods (when built) reduce overfetching
- Existing `revalidatePath` in Server Actions; auth flows use `router.refresh()`
- No dedicated performance monitoring yet

## Key Files to Create/Change (planned)

- `app/(admin)/dashboard/layout.tsx`, `app/(client)/layout.tsx` (rendering exports)
- Repository query methods + Mongo indexes on Job/Application/User
- `app/actions/*` mutation revalidation patterns
- Optional `loading.tsx` / `error.tsx` per route group

## Recording Outline

Revisit `force-dynamic` / `revalidate = 0`; when to keep vs when public pages might revalidate later.

## Next

Lecture 149 — Avoid Overfetching (`./lecture-149-avoid-overfetching.md`).
