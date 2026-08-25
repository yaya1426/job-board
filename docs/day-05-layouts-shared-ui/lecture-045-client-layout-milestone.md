# Lecture 45 - Project Milestone: Apply Layout for Client Pages | معلم تخطيط الصفحات العامة

## Goal

Ship the public application shell: client route-group layout, top navigation, and footer across all `(client)` pages.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `app/(client)/layout.tsx`
- `components/navbar/NavbarHeader.tsx`
- `components/navbar/NavbarLinks.tsx` — client active links (`usePathname`)
- `components/navbar/NavbarFooter.tsx`
- `app/(client)/page.tsx`, `jobs/page.tsx`, `jobs/[id]/page.tsx`

## What Was Built

Commits `51db732` (client navigation) and `a812be8` (client footer) added the public chrome. Public routes moved into `(client)` with a shared layout so every candidate-facing page gets consistent header, links, and footer without copy-paste.

## Recording Outline

- Create `app/(client)/layout.tsx` with min-height background wrapper.
- Build `NavbarHeader` with logo link to `/`.
- Add `NavbarLinks` for HOME and JOBS with active state (`usePathname`).
- Add `NavbarFooter` with course/product links or minimal copyright.
- Remove duplicate nav markup from individual pages.
- Verify `/`, `/jobs`, `/jobs/[id]` all show header + footer.
- Test client navigation preserves layout (soft nav).
- Deploy navigation milestone.
- Note `NavbarAccount` evolves Day 10 for login/sign-out — placeholder OK on Day 5.
- Transition to admin layout milestone.

## Verify in Repo

- All files under `app/(client)/` inherit client layout automatically.
- `NavbarLinks` uses `Link` from `next/link` and highlights `/jobs` for nested routes (later fix).
- Footer appears on home and jobs pages.

## Notes / Gaps

- `NavbarAccount` / `SignOutButton` are Day 10 — Day 5 may show static "LOG IN" links.
- Landing components (`HeroSection`, `FeaturedJobs`) enriched Day 6.
- Active link matching for `/jobs/[id]` may need `startsWith("/jobs")` — later polish.

## Next

[Lecture 46 - Project Milestone: Apply Layout for Admin Pages](./lecture-046-admin-layout-milestone.md)
