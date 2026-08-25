# Lecture 39 - Tailwind CSS v4: Utility-First Styling | Tailwind CSS الإصدار 4

## Goal

Install and configure Tailwind CSS v4 using the CSS-first setup: `@import "tailwindcss"` in `globals.css` instead of a JavaScript config file.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `app/globals.css` — `@import "tailwindcss"`, `@theme inline`, CSS variables
- `app/layout.tsx` — imports `globals.css`
- `package.json` — `tailwindcss`, `@tailwindcss/postcss` (or equivalent v4 stack)

## What Was Built

Students added Tailwind v4 to the Next.js project, wired PostCSS, and confirmed utility classes work in `page.tsx` components. v4 moves theme extension into CSS via `@theme` blocks and custom properties.

## Recording Outline

- Explain utility-first CSS: compose UI with classes like `flex`, `p-4`, `text-sm`.
- Show v4 entry: `@import "tailwindcss"` at top of `globals.css`.
- Contrast v3 `tailwind.config.js` with v4 CSS-native configuration.
- Introduce `@theme inline` for mapping design tokens to Tailwind color utilities.
- Show `@custom-variant dark` for class-based dark mode.
- Apply a few utilities on a page to prove setup (`bg-background`, `text-foreground`).
- Mention `tw-animate-css` import for animation utilities.
- Explain colocation: styles live on components, not separate CSS files per page.
- Note fonts: Space Grotesk + JetBrains Mono imported in `globals.css`.
- Transition to shadcn/ui installation.

## Verify in Repo

- `app/globals.css` starts with Tailwind import.
- `@theme inline` block maps `--color-background`, `--color-primary`, etc.
- Dev server compiles without PostCSS/Tailwind errors.
- Pages render with Tailwind classes applied.

## Notes / Gaps

- Geist fonts in `app/layout.tsx` coexist with Space Grotesk in CSS — brutalist theme favors the CSS imports.
- Full semantic token set (neon, warning, sidebar) grew after initial Day 5 install.
- RTL and i18n theming is Day 15.

## Next

[Lecture 40 - Installing & Configuring shadcn/ui](./lecture-040-shadcn-ui.md)
