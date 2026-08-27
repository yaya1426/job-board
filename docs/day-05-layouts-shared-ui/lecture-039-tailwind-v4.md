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

Tailwind v4 was added to the Next.js project, wired PostCSS, and confirmed utility classes work in `page.tsx` components. v4 moves theme extension into CSS via `@theme` blocks and custom properties.

## Implementation steps

### Step 1: Install Tailwind v4 dependencies

```bash
npm install tailwindcss @tailwindcss/postcss tw-animate-css
```

Confirm in `package.json`:

```json
"tailwindcss": "^4",
"@tailwindcss/postcss": "^4",
"tw-animate-css": "^1.4.0"
```

### Step 2: Configure PostCSS

```1:7:postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

No `tailwind.config.js` — v4 is CSS-first.

### Step 3: Add Tailwind import to `globals.css`

```1:5:app/globals.css
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap");

@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
```

### Step 4: Add dark mode variant

```7:8:app/globals.css
/* Tailwind v4 dark mode controlled by `.dark` class */
@custom-variant dark (&:where(.dark, .dark *));
```

### Step 5: Prove utilities work on a page

Add classes to any `page.tsx`:

```tsx
<main className="bg-background text-foreground p-8">
  <h1 className="text-4xl font-bold">TAILWIND WORKS</h1>
</main>
```

Run `npm run dev` — no PostCSS/Tailwind compile errors.

## Verify
- `app/globals.css` starts with `@import "tailwindcss"`.
- `postcss.config.mjs` uses `@tailwindcss/postcss`.
- `@theme inline` block maps `--color-background`, `--color-primary`, etc.
- Dev server compiles without PostCSS/Tailwind errors; utility classes render on pages.

## Outcome

Install and configure Tailwind CSS v4 using the CSS-first setup: `@import "tailwindcss"` in `globals.css` instead of a JavaScript config file.

## Notes / Gaps

- Geist fonts in `app/layout.tsx` coexist with Space Grotesk in CSS — brutalist theme favors the CSS imports.
- Full semantic token set (neon, warning, sidebar) grew after initial Day 5 install.
- RTL and i18n theming is Day 15.

## Next

[Lecture 40 - Installing & Configuring shadcn/ui](./lecture-040-shadcn-ui.md)
