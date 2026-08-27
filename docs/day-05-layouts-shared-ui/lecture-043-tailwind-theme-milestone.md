# Lecture 43 - Project Milestone: Setup Tailwind Theme | معلم إعداد ثيم Tailwind

## Goal

Complete the Tailwind theme milestone: fonts, color tokens, shadcn mapping, and brutalist utilities committed and deployed.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `app/globals.css` — full `:root` palette, `@theme inline`, font imports, brutal utilities
- `components.json` — `baseColor: "neutral"`, `cssVariables: true`
- `components/ui/*` — primitives using theme tokens

## What Was Built

The CSS variable palette was finalized, verified shadcn components pick up colors correctly, and deployed the theme (`c4ac5e0`). Every major surface class (`bg-background`, `text-accent`, `border-border`) resolves through the shared token layer.

## Implementation steps

### Step 1: Audit `:root` variables for completeness

Confirm all semantic colors exist:

- Core: `background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`, `destructive`
- Borders: `border`, `input`, `ring`
- Extra: `neon`, `warning`, `info`
- Sidebar: `sidebar-background` through `sidebar-ring`

### Step 2: Confirm `@theme inline` maps every variable

```14:62:app/globals.css
@theme inline {
  --color-background: hsl(var(--background));
  /* ... every --color-* maps to a :root variable ... */
  --color-sidebar-ring: hsl(var(--sidebar-ring));
}
```

### Step 3: Test component matrix

| Component | Test |
|-----------|------|
| `Button` | All variants (`default`, `accent`, `outline`, `destructive`) |
| `Card` | `bg-card text-card-foreground` |
| `Input` | Focus ring uses `ring` token |
| `Badge` | Status colors resolve |

### Step 4: Run production build

```bash
npm run build
```

Catch missing token references before deploy.

### Step 5: Deploy and verify on staging

Hard-refresh `dev.wazifa.app` and `dev-admin.wazifa.app`. Inspect computed styles in DevTools — `background-color` should resolve through CSS variables.

```bash
git log --oneline | grep -i brutal
```

## Verify
- `globals.css` has coherent light-theme tokens (dark optional).
- shadcn components render with themed colors on `/` and `/dashboard`.
- Git history includes `c4ac5e0` or equivalent brutal design commit.

## Outcome

Complete the Tailwind theme milestone: fonts, color tokens, shadcn mapping, and brutalist utilities committed and deployed.

## Notes / Gaps

- Sidebar-specific tokens added alongside admin layout (Lecture 46).
- Neon/warning/info semantics used heavily in admin tables (Day 6+).
- Font loading: Google Fonts import in CSS vs `next/font` — project uses both approaches.

## Next

[Lecture 44 - Next.js Layout Deep Dive](./lecture-044-layout-deep-dive.md)
