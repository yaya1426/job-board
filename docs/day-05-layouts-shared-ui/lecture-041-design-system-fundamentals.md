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

Semantic color tokens were defined in `:root` and mapped them through `@theme inline` so components use `bg-background`, `text-muted-foreground`, `border-border` instead of hard-coded hex values. Typography roles: `font-heading`, `font-mono` for brutalist hierarchy.

## Implementation steps

### Step 1: Define semantic tokens in `:root`

```81:134:app/globals.css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 0%;
  /* ... */
  --accent: 120 100% 40%;
  --accent-foreground: 0 0% 0%;
  --border: 0 0% 0%;
  --radius: 0px;
  --font-heading: "Space Grotesk", sans-serif;
  --font-body: "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  --border-thick: 3px;
  --border-thin: 2px;
}
```

Values are HSL components (no `hsl()` wrapper) — shadcn convention.

### Step 2: Map tokens to Tailwind via `@theme inline`

```14:76:app/globals.css
@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-accent: hsl(var(--accent));
  --color-border: hsl(var(--border));
  /* ... */
  --font-sans: var(--font-body);
  --font-mono: var(--font-mono);
  --radius-sm: var(--radius);
  /* all radius tokens = 0px for brutalist */
}
```

This makes `bg-background`, `text-accent`, `border-border` work as Tailwind utilities.

### Step 3: Add base typography rules

```169:189:app/globals.css
@layer base {
  * {
    @apply border-border outline-ring/50;
    font-family: var(--font-body);
  }
  body {
    @apply bg-background text-foreground;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.02em;
  }
}
```

### Step 4: Verify shadcn components consume tokens

Inspect `components/ui/button.tsx` — classes like `bg-foreground`, `text-background`, `hover:bg-accent` resolve through the token layer.

### Step 5: Establish the rule

Pages compose components. Pages do not invent new button styles or raw hex colors.

## Verify
- `globals.css` defines `--background`, `--foreground`, `--accent`, `--border`.
- `@theme inline` maps variables to `--color-*` utilities.
- UI components use token-based classes, not raw `#hex` in TSX.
- `BrutalUI.tsx` exports `StatusBadge` and `AiScore`.

## Outcome

Introduces design system thinking for `wazifa.app`: semantic tokens, typography roles, spacing rhythm, and reusable primitives instead of one-off page styles.

## Notes / Gaps

- Sidebar tokens added when admin layout matured.
- Application status badge variants tied to Mongo enum values (later days).
- Full component library grows Days 6–12; Day 5 sets the rules.

## Next

[Lecture 42 - Design Styles & AI Layout Workflow](./lecture-042-design-styles-ai-layout-workflow.md)
