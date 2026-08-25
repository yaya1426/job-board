# Lecture 38 - Day 5 Plan | خطة اليوم الخامس

## Goal

Preview Day 5: establish the shared visual foundation — Tailwind CSS v4, shadcn/ui, a brutalist design direction, and separate layouts for client and admin surfaces.

## Implementation Status

Planned (day opener; implementation Lectures 39–46)

## Key Files (as implemented today)

- `app/globals.css` — Tailwind v4 imports, theme tokens, brutalist utilities
- `components.json` — shadcn/ui configuration
- `components/ui/` — button, badge, card, input, textarea
- `app/(client)/layout.tsx` — public shell with navbar + footer
- `app/(admin)/dashboard/layout.tsx` — admin shell with sidebar

## What Was Built

Day 5 turns the routing skeleton into a recognizable product. Students install styling tooling, define design tokens, add shared UI primitives, and wrap each route group in its own layout so public and admin experiences feel distinct.

## Recording Outline

- Frame Day 5 as "architecture becomes visible to users."
- Preview Tailwind v4 CSS-first config in `globals.css` (no legacy `tailwind.config.js`).
- Preview shadcn/ui as copy-paste components, not a black-box npm UI kit.
- Name the brutalist direction: bold borders, mono accents, high contrast.
- Preview client layout: `NavbarHeader` + `NavbarFooter`.
- Preview admin layout: `AdminSidebar` + main content area.
- List Day 5 commits: `81878e0` (shadcn), `c4ac5e0` (brutal DS), `51db732` (nav), `a812be8` (footer), `0e46b8a` (admin layout).
- Note rename `(app)` → `(client)` happens during Day 5.
- Walk lecture order 39–47.
- Transition to Tailwind v4 lecture.

## Verify in Repo

- `package.json` includes Tailwind v4 and shadcn-related deps.
- `docs/day-05-layouts-shared-ui/README.md` lists lectures 38–47.
- Both route-group layouts exist.

## Notes / Gaps

- Navbar auth components (`NavbarAccount`, `SignOutButton`) evolved Day 10 — Day 5 may have shown static account area.
- `BrutalUI.tsx` is an early helper file; some patterns moved into route components.
- `force-dynamic` on layouts added later for Mongoose — not Day 5 focus.

## Next

[Lecture 39 - Tailwind CSS v4](./lecture-039-tailwind-v4.md)
