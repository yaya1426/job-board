# Lecture 147 - Measure Before Optimizing

## Goal

Establish baseline with DevTools, server logs, Atlas insights, Lighthouse — find slow paths before changing code.

## Implementation Status

**Planned — not in codebase**

## Planned Scope (from course design)

Establish baseline with DevTools, server logs, Atlas insights, Lighthouse — find slow paths before changing code.

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

Establish baseline with DevTools, server logs, Atlas insights, Lighthouse — find slow paths before changing code.

## Next

Lecture 148 — Review Rendering Strategy (`./lecture-148-review-rendering-strategy.md`).
