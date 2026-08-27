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

Commit `81878e0` deployed shadcn installation. The shadcn CLI was run (or equivalent init), configured path aliases (`@/components/ui`), and added button, badge, card, and input components as owned source files — not locked inside `node_modules`.

## Implementation steps

### Step 1: Initialize shadcn/ui

```bash
npx shadcn@latest init
```

Creates `components.json`:

```1:23:components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}
```

### Step 2: Add the `cn()` helper

```1:6:lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Step 3: Add first components

```bash
npx shadcn@latest add button badge card input
```

### Step 4: Inspect a generated component

```7:8:components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-heading text-sm font-bold uppercase brutal-border brutal-shadow brutal-hover transition-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
```

Owned source — edit freely. Not a black-box npm package.

### Step 5: Use `<Button>` on a page

```tsx
import { Button } from "@/components/ui/button";

<Button variant="accent">BROWSE JOBS</Button>
```

Run `npm run build` to catch import/path issues early.

## Verify
- `components.json` exists with correct aliases.
- `components/ui/button.tsx` exports `Button`.
- `cn` is imported from `@/lib/utils` in UI components.
- `npm run build` succeeds with shadcn components.

## Outcome

Add shadcn/ui to the project: `components.json`, `lib/utils.ts` `cn()` helper, and first primitives under `components/ui/`.

## Notes / Gaps

- `textarea` added later for forms — Day 5 core set was button/badge/card/input.
- shadcn CLI flags evolve; verify against current docs in this repository.
- Badge variants extended for application status (`BrutalUI.tsx` / admin tables).

## Next

[Lecture 41 - Design System Fundamentals](./lecture-041-design-system-fundamentals.md)
