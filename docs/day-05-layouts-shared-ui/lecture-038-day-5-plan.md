# Lecture 38 - Day (5) Plan | خطة اليوم الخامس

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

Day 5 turns the routing skeleton into a recognizable product. Install styling tooling, define design tokens, add shared UI primitives, and wrap each route group in its own layout so public and admin experiences feel distinct.

## Implementation steps

### Step 1: Preview Day 5 deliverables

| Area | Key files |
|------|-----------|
| Tailwind v4 | `app/globals.css`, `postcss.config.mjs` |
| shadcn/ui | `components.json`, `components/ui/*`, `lib/utils.ts` |
| Brutalist tokens | `app/globals.css` `:root` + `@theme inline` |
| Client shell | `app/(client)/layout.tsx`, `NavbarHeader`, `NavbarFooter` |
| Admin shell | `app/(admin)/dashboard/layout.tsx`, `AdminSidebar` |

### Step 2: Draw the layout tree to build

```
app/layout.tsx                    ← root: html, body, globals.css
├── (client)/layout.tsx           ← NavbarHeader + Footer
│   ├── page.tsx
│   └── jobs/...
└── (admin)/dashboard/layout.tsx  ← AdminSidebar + main
    └── page.tsx, jobs/...
```

### Step 3: Review lecture sequence

Lecture order: Tailwind v4 (39) → shadcn (40) → design system (41) → brutalist workflow (42) → theme milestone (43) → layout deep dive (44) → client layout (45) → admin layout (46) → recap (47).

### Step 4: Name Day 5 commits

- `81878e0` — shadcn install
- `c4ac5e0` — brutal design system
- `51db732` — client navigation
- `a812be8` — client footer
- `0e46b8a` — admin layout

### Step 5: Note rename context

Route group `(app)` → `(client)` happens during Day 5. URLs unchanged.

## Verify
- `package.json` includes Tailwind v4 and shadcn-related deps.
- Lecture index lists 38–47.
- Both route-group layout files exist (or will be created in Lectures 45–46).
- `docs/day-05-layouts-shared-ui/README.md` lists lectures 38–47.
- Both route-group layouts exist.

## Outcome

Preview Day 5: establish the shared visual foundation — Tailwind CSS v4, shadcn/ui, a brutalist design direction, and separate layouts for client and admin surfaces.

## Notes / Gaps

- Navbar auth components (`NavbarAccount`, `SignOutButton`) evolved Day 10 — Day 5 may have shown static account area.
- `BrutalUI.tsx` is an early helper file; some patterns moved into route components.
- `force-dynamic` on layouts added later for Mongoose — not Day 5 focus.

## Next

[Lecture 39 - Tailwind CSS v4](./lecture-039-tailwind-v4.md)
