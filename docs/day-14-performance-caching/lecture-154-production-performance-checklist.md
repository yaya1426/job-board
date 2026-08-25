# Lecture 154 - Production Performance Checklist

## Goal

Deploy verification: no static DB surprises, indexes match filters, no full-collection reads, auth fast.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Deploy verification: no static DB surprises, indexes match filters, no full-collection reads, auth fast.

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

Deploy verification: no static DB surprises, indexes match filters, no full-collection reads, auth fast.

## Next

Day recap and course continuation.
