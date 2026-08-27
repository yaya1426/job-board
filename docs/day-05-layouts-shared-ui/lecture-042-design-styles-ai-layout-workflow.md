# Lecture 42 - Design Styles & AI Layout Workflow | أنماط التصميم وسير عمل التخطيط بالذكاء الاصطناعي

## Goal

Choose the brutalist visual direction for wazifa.app and demonstrate a practical workflow: reference mood → AI-assisted layout draft → engineer into tokens and shadcn components.

## Implementation Status

Implemented (brutalist theme in CSS); External (AI tooling workflow is process, not a repo file)

## Key Files (as implemented today)

- `app/globals.css` — brutalist utilities (e.g. `.brutal-border`, thick borders, accent neon)
- `components/navbar/NavbarHeader.tsx` — brutal nav shell
- `components/BrutalUI.tsx` — domain-specific brutal compositions

## What Was Built

Commit `c4ac5e0` ("Day 5: Brutal Design System") applied bold borders, zero subtle shadows, mono labels, and high-contrast accents. AI tools were used to explore layout ideas, then translated winners into Tailwind classes bound to design tokens — not pasted unmaintainable HTML.

## Implementation steps

### Step 1: Name the brutalist traits

- Thick borders (`--border-thick: 3px`)
- Zero border-radius (`--radius: 0px`)
- Uppercase headings, mono metadata
- High-contrast accent green (`--accent: 120 100% 40%`)
- Hard shadows, no soft gradients

### Step 2: Add brutalist utility classes

```195:224:app/globals.css
@layer components {
  .brutal-border {
    border: var(--border-thick) solid hsl(var(--border));
  }
  .brutal-shadow {
    box-shadow: 4px 4px 0px 0px hsl(var(--foreground));
  }
  .brutal-hover:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px 0px hsl(var(--foreground));
  }
}
```

### Step 3: Apply brutalist shell to navbar

```7:18:components/navbar/NavbarHeader.tsx
    <nav className="brutal-border border-t-0 border-x-0 bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-heading text-2xl font-bold tracking-tight"
        >
          WAZIFA<span className="text-accent">_</span>
        </Link>
```

### Step 4: Demo AI layout workflow

1. Prompt AI for a job board admin table layout.
2. Critique output — replace arbitrary colors with `bg-card`, `text-foreground`.
3. Replace generic buttons with `<Button variant="accent">`.
4. Ship owned code, not pasted HTML.

### Step 5: Disable soft transitions for brutal feel

Use `transition-none` on interactive elements (navbar links, buttons) — instant state changes, not smooth fades.

## Verify
- `globals.css` includes `.brutal-border`, `.brutal-shadow`, `.brutal-hover`.
- Public pages share consistent border/typography language.
- No one-off neon hex in page files — tokens used instead.
- `globals.css` includes brutalist utility classes used across nav/cards.

## Outcome

Choose the brutalist visual direction for wazifa.app and demonstrate a practical workflow: reference mood → AI-assisted layout draft → engineer into tokens and shadcn components.

## Notes / Gaps

- AI tool choice (ChatGPT, v0, etc.) varies by student — workflow is the lesson.
- Some hover transitions intentionally disabled (`transition-none`) for brutal feel.
- Landing `HeroSection` / `FeaturedJobs` refined in Day 6 with mock/real data.

## Next

[Lecture 43 - Project Milestone: Setup Tailwind Theme](./lecture-043-tailwind-theme-milestone.md)
