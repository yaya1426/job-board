# Day 5 - Layouts and Shared UI

## Goal

Set up the shared visual foundation: Tailwind CSS v4, shadcn/ui, a brutalist design language, public and admin layouts, and shared navigation.

## Lectures Covered

- Lecture 38 - Day 5 Plan
- Lecture 39 - Tailwind CSS v4: Utility-First Styling
- Lecture 40 - Installing & Configuring shadcn/ui
- Lecture 41 - Design System Fundamentals
- Lecture 42 - Design Styles & AI Layout Workflow
- Lecture 43 - Project Milestone: Setup Tailwind Theme
- Lecture 44 - Next.js Layout Deep Dive
- Lecture 45 - Project Milestone: Apply Layout for Client Pages
- Lecture 46 - Project Milestone: Apply Layout for Admin Pages
- Lecture 47 - Recap Day 5

## Commit Evidence

Commits found for this day:

- `81878e0` - Day 5: Deploy Shadcn installation
- `c4ac5e0` - Day 5: Brutal Design System
- `51db732` - Day 5: Client Navigation
- `a812be8` - Day 5: Client Footer
- `0e46b8a` - Day 5: Admin Layout

Key files changed:

- `app/globals.css`
- `components.json`
- `components/ui/button.tsx`
- `components/ui/badge.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/BrutalUI.tsx`
- `components/navbar/NavbarHeader.tsx`
- `components/navbar/NavbarFooter.tsx`
- `components/navbar/AdminSidebar.tsx`
- `app/(client)/layout.tsx`
- `app/(admin)/dashboard/layout.tsx`
- `lib/utils.ts`
- `package.json`
- `package-lock.json`

## Final State

By the end of the day, the project had:

- Tailwind CSS v4 installed and configured.
- shadcn/ui installed.
- Shared UI primitives including button, badge, card, and input.
- A first brutalist design system direction.
- A client layout with public navigation and footer.
- An admin dashboard layout with sidebar navigation.
- Public routes moved into the current `(client)` group.

## Architecture Decisions

- Layout responsibilities are separated by route group:
  - `app/(client)/layout.tsx` for public pages.
  - `app/(admin)/dashboard/layout.tsx` for dashboard pages.
- Reusable UI primitives live under `components/ui/`.
- Navigation components live under `components/navbar/`.

## Teaching Narrative

This day connects UI polish to architecture. Students learn that layouts are not just visual wrappers; they define the application shell for each surface.

The admin/client split becomes visible to users, not just present in folder names.

## Notes

- `components/BrutalUI.tsx` appears as an early design-system experiment. Later work leans more on route-specific components plus shared primitives.
