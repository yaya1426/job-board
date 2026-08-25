# Lecture 152 - Split Server and Client Components

## Goal

Keep data-heavy UI server-rendered; client only for forms, pathname, sign-out, interactive filters.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Keep data-heavy UI server-rendered; client only for forms, pathname, sign-out, interactive filters.

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

Keep data-heavy UI server-rendered; client only for forms, pathname, sign-out, interactive filters.

## Next

Lecture 153 — Loading and Error States (`./lecture-153-loading-and-error-states.md`).
