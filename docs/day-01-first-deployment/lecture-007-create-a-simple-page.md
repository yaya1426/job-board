# Lecture 7 - Create a Simple Page | إنشاء صفحة بسيطة

## Goal

Replace the generic starter with a minimal branded page so students see a real product surface before deployment.

## Implementation Status

Partial (original simple `app/page.tsx` evolved into the full landing at `app/(client)/page.tsx` with `HeroSection` and `FeaturedJobs` from Day 6).

## Key Files (as implemented today)

- `app/(client)/page.tsx` (evolved from Day 1 `app/page.tsx`)
- `app/layout.tsx`
- `app/globals.css`
- `components/landing/HeroSection.tsx` (Day 6)
- `components/landing/FeaturedJobs.tsx` (Day 6)

## What Was Built

- Day 1: edited `app/page.tsx` with a simple title/message (commit `6c1b9eb` — “Change title in page.tsx”).
- A visible, custom page proving the App Router maps `page.tsx` to the `/` route.
- Global styles through `app/globals.css` (Tailwind base imported at layout level).
- Foundation for later landing components; today the home page fetches jobs server-side.

## Recording Outline

- Open `app/page.tsx` and explain file-based routing: this file is the `/` route.
- Change the visible title or heading to something course-branded (e.g. job board / wazifa).
- Show that edits hot-reload in `npm run dev`.
- Briefly explain Server Components default: no `"use client"` needed for static content.
- Point at `app/layout.tsx` wrapping all pages with fonts and global CSS.
- Emphasize: one small visible change, immediately verifiable in the browser.
- Preview that this page will be the first thing users see on the deployed URL.
- Avoid feature scope—no navbar, database, or auth yet.

## Verify in Repo

- Open `app/(client)/page.tsx` (current home) or git history for original `app/page.tsx` at commit `6c1b9eb`.
- Run `npm run dev` and confirm the home route renders custom content.

## Notes / Gaps

- The simple Day 1 page was replaced by route-group architecture on Day 4 (`(client)` group) and rich landing UI on Day 6.
- Current home page calls `getJobs()` from the jobs service—far beyond Day 1 scope.
- Metadata in `app/layout.tsx` still reads `"Job Board"`; SEO work is Day 13.

## Next

[Lecture 8 — GitHub Repo Setup](./lecture-008-github-repo-setup.md)
