# Lecture 26 - Link and Navigation | الربط والتنقل

## Goal

Use `next/link` for client-side navigation between home, jobs list, and job details without full page reloads.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `app/(client)/jobs/[id]/page.tsx` — `Link` back to `/jobs` ("← ALL POSITIONS")
- `components/jobs/JobsListingWrapper.tsx` — job cards linking to `/jobs/[id]` (evolved UI)
- `components/navbar/NavbarLinks.tsx` — active nav links (Day 5+; Day 3 may have used plain `<a>` or early nav)

## What Was Built

Students wired list → detail navigation with `<Link href={`/jobs/${id}`}>`. The job details page links back to `/jobs`. This teaches prefetching, soft navigation, and avoiding raw `<a href>` for internal routes.

## Recording Outline

- Import `Link` from `next/link` in a server or client component.
- Replace internal `<a href="/jobs">` with `<Link href="/jobs">` and explain why.
- Build links from the jobs list to `/jobs/[id]` using each job's id.
- Add a back link on the details page to `/jobs`.
- Explain prefetch: Next.js prefetches linked routes in viewport by default.
- Contrast `useRouter().push()` for imperative navigation (auth flows later).
- Show browser network tab: client navigation avoids full document reload.
- Note: external URLs still use `<a target="_blank" rel="noopener noreferrer">`.
- Preview navbar links in Day 5 (`NavbarLinks` with `usePathname` for active state).

## Verify in Repo

- `Link` from `next/link` used on job details page for `/jobs` back link.
- Jobs listing navigates to `/jobs/<id>` without full reload.
- No internal routes use raw `<a href="/...">` for in-app navigation in core job flows.

## Notes / Gaps

- `NavbarLinks` is a client component (needs `usePathname`) — added Day 5.
- Active link styling (`pathname.startsWith("/jobs")`) is later polish.
- Admin sidebar uses `Link` similarly in `AdminSidebar.tsx` (Day 5).

## Next

[Lecture 27 - Project Milestone: Core Routes](./lecture-027-project-milestone-core-routes.md)
