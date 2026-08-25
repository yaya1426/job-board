# Lecture 44 - Next.js Layout Deep Dive | تعمق في تخطيطات Next.js

## Goal

Explain nested layouts in the App Router: root layout vs route-group layouts, what persists across navigation, and where to put shared chrome.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `app/layout.tsx` — root HTML shell, fonts, `SessionProvider`, `globals.css`
- `app/(client)/layout.tsx` — `NavbarHeader` + `NavbarFooter` wrapper
- `app/(admin)/dashboard/layout.tsx` — `AdminSidebar` + main content; admin auth check (Day 10)
- `app/(auth)/layout.tsx` — minimal auth shell (later day)

## What Was Built

Day 5 students learned layout composition: root layout applies everywhere; group layouts add surface-specific UI without redefining `<html>`. Navigating between `/jobs` and `/` keeps navbar/footer mounted (client layout children swap). Admin pages share sidebar across `/dashboard/*`.

## Recording Outline

- Draw layout tree: Root → (client) layout → page.
- Draw admin tree: Root → (admin)/dashboard layout → page.
- Show `app/(client)/layout.tsx` — wraps `{children}` with nav + footer.
- Show `app/(admin)/dashboard/layout.tsx` — sidebar + `<main>`.
- Explain layout persistence during client-side navigation.
- Clarify what belongs in root vs group layout (providers vs nav).
- Mention `export const dynamic` on layouts came later for MongoDB — preview only.
- Contrast layout vs template (`template.tsx` remounts — not used here).
- Anti-pattern: duplicating navbar in every `page.tsx`.
- Split milestones: client layout next, then admin.

## Verify in Repo

- `app/(client)/layout.tsx` imports `NavbarHeader` and `NavbarFooter`.
- `app/(admin)/dashboard/layout.tsx` imports `AdminSidebar`.
- Navigating `/` → `/jobs` keeps header visible without full reload.

## Notes / Gaps

- Dashboard layout now calls `getCurrentUser()` and redirects — Day 10 hardening.
- Auth layout `(auth)` removes public navbar for login/signup — post-Day 5.
- `SessionProvider` in root layout is Day 10.

## Next

[Lecture 45 - Project Milestone: Apply Layout for Client Pages](./lecture-045-client-layout-milestone.md)
