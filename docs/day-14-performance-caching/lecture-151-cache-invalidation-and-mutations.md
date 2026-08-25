# Lecture 151 - Cache Invalidation and Mutations

## Goal

When to `revalidatePath`, why auth needs `router.refresh()`, mutation stale-page rules.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

When to `revalidatePath`, why auth needs `router.refresh()`, mutation stale-page rules.

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

When to `revalidatePath`, why auth needs `router.refresh()`, mutation stale-page rules.

## Next

Lecture 152 — Split Server and Client Components (`./lecture-152-split-server-and-client-components.md`).
