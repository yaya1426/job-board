# Lecture 41 - Design System Fundamentals | أساسيات نظام التصميم

## Goal

Introduce design system thinking for `wazifa.app`: semantic tokens, typography roles, spacing rhythm, and reusable primitives instead of one-off page styles.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `app/globals.css` — CSS variables (`--background`, `--accent`, `--border`, …)
- `components/ui/button.tsx`, `badge.tsx`, `card.tsx`, `input.tsx`
- `components/BrutalUI.tsx` — early composed helpers (`StatusBadge`, `AiScore`)

## What Was Built

Students defined semantic color tokens in `:root` and mapped them through `@theme inline` so components use `bg-background`, `text-muted-foreground`, `border-border` instead of hard-coded hex values. Typography roles: `font-heading`, `font-mono` for brutalist hierarchy.

## Recording Outline

- Define design system: tokens + components + patterns, not random class strings.
- Show CSS variables in `globals.css` `:root` block.
- Map variables to Tailwind via `@theme inline` (`--color-background`, etc.).
- Explain semantic naming: `primary`, `accent`, `muted` vs `blue-500`.
- Introduce typography scale: heading font for titles, mono for labels/metadata.
- Show shadcn components consuming tokens via standard class names.
- Introduce `BrutalUI.tsx` as thin compositions over primitives (status badge, AI score).
- Rule: pages compose components; pages don't invent new button styles.
- Contrast with inline styles and arbitrary values — use sparingly.
- Transition to brutalist visual direction and AI layout workflow.

## Verify in Repo

- `globals.css` defines `--background`, `--foreground`, `--accent`, `--border`.
- UI components use token-based classes, not raw `#hex` in TSX.
- `BrutalUI.tsx` exports `StatusBadge` and `AiScore`.

## Notes / Gaps

- Sidebar tokens added when admin layout matured.
- Application status badge variants tied to Mongo enum values (later days).
- Full component library grows Days 6–12; Day 5 sets the rules.

## Next

[Lecture 42 - Design Styles & AI Layout Workflow](./lecture-042-design-styles-ai-layout-workflow.md)
