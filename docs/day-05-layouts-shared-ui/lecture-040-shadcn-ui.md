# Lecture 40 - Installing & Configuring shadcn/ui | تثبيت وإعداد shadcn/ui

## Goal

Add shadcn/ui to the project: `components.json`, `lib/utils.ts` `cn()` helper, and first primitives under `components/ui/`.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `components.json` — shadcn schema, aliases, `new-york` style
- `lib/utils.ts` — `cn()` via `clsx` + `tailwind-merge`
- `components/ui/button.tsx`
- `components/ui/badge.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/textarea.tsx` — added in later feature work

## What Was Built

Commit `81878e0` deployed shadcn installation. Students ran the shadcn CLI (or equivalent init), configured path aliases (`@/components/ui`), and added button, badge, card, and input components as owned source files — not locked inside `node_modules`.

## Recording Outline

- Explain shadcn philosophy: components you own and can edit.
- Show `components.json`: `style: "new-york"`, `rsc: true`, `cssVariables: true`.
- Walk `npx shadcn@latest init` flow (account for CLI version changes in recording).
- Add `cn()` to `lib/utils.ts` for conditional class merging.
- Install `button`, `badge`, `card`, `input` via CLI add commands.
- Open one component file — show it's regular React + Tailwind, not magic.
- Use `<Button>` on a page to verify import path `@/components/ui/button`.
- Explain lucide-react as default icon set in shadcn config.
- Deploy after install (`81878e0`) to catch build issues early.
- Transition to design system fundamentals.

## Verify in Repo

- `components.json` exists with correct aliases.
- `components/ui/button.tsx` exports `Button`.
- `cn` is imported from `@/lib/utils` in UI components.
- `npm run build` succeeds with shadcn components.

## Notes / Gaps

- `textarea` added later for forms — Day 5 core set was button/badge/card/input.
- shadcn CLI flags evolve; verify against current docs when recording.
- Badge variants extended for application status (`BrutalUI.tsx` / admin tables).

## Next

[Lecture 41 - Design System Fundamentals](./lecture-041-design-system-fundamentals.md)
