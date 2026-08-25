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

Commit `c4ac5e0` ("Day 5: Brutal Design System") applied bold borders, zero subtle shadows, mono labels, and high-contrast accents. Students used AI tools to explore layout ideas, then translated winners into Tailwind classes bound to design tokens — not pasted unmaintainable HTML.

## Recording Outline

- Show brutalist references: thick borders, stark contrast, raw typography.
- Name wazifa.app traits: `brutal-border`, uppercase labels, `font-mono` metadata.
- Demo AI workflow: prompt for job board admin table layout → critique output.
- Translate AI draft: replace arbitrary colors with `bg-card`, `text-foreground`.
- Replace generic buttons with shadcn `<Button variant="...">`.
- Show before/after: generic Tailwind vs tokenized brutalist shell.
- Warn: AI output is a sketch, not production code — ownership matters.
- Connect to course pedagogy: taste + systems, not pixel copying.
- Show `NavbarHeader` sticky bar with brutal border bottom.
- Transition to formal theme milestone commit.

## Verify in Repo

- `globals.css` includes brutalist utility classes used across nav/cards.
- Public pages share consistent border/typography language.
- No one-off neon hex in page files — tokens used instead.

## Notes / Gaps

- AI tool choice (ChatGPT, v0, etc.) varies by student — workflow is the lesson.
- Some hover transitions intentionally disabled (`transition-none`) for brutal feel.
- Landing `HeroSection` / `FeaturedJobs` refined in Day 6 with mock/real data.

## Next

[Lecture 43 - Project Milestone: Setup Tailwind Theme](./lecture-043-tailwind-theme-milestone.md)
