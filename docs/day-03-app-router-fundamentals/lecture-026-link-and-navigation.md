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

List → detail navigation with `<Link href={`/jobs/${id}`}>`. The job details page links back to `/jobs`. Covers prefetching, soft navigation, and avoiding raw `<a href>` for internal routes.

## Implementation steps

### Step 1: Import `Link` from `next/link`

Use in Server or Client Components — no `"use client"` required for basic `Link`.

```2:2:app/(client)/jobs/[id]/page.tsx
import Link from "next/link";
```

### Step 2: Add back navigation on the details page

```58:63:app/(client)/jobs/[id]/page.tsx
      <Link
        href="/jobs"
        className="font-mono text-sm text-muted-foreground hover:text-accent transition-none"
      >
        ← ALL POSITIONS
      </Link>
```

### Step 3: Link from job cards to dynamic routes

```31:31:components/jobs/JobCards.tsx
            href={`/jobs/${job.id}`}
```

Same pattern in `components/landing/FeaturedJobs.tsx` for home page featured jobs.

### Step 4: Wire navbar links (Day 5 pattern)

```7:16:components/navbar/NavbarLinks.tsx
const links = [
  {
    href: "/",
    label: "HOME",
  },
  {
    href: "/jobs",
    label: "BROWSE JOBS",
  },
];
```

```26:35:components/navbar/NavbarLinks.tsx
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "font-heading text-sm font-bold uppercase border-b-2 border-transparent pb-1 transition-none hover:border-accent hover:text-accent",
              isActive && "border-accent text-accent",
            )}
          >
            {link.label}
          </Link>
```

Day 3: plain `Link` without active state is fine; `usePathname` active styling is Day 5.

### Step 5: Review `Link` vs `<a>` vs `useRouter().push()`

- Internal routes → `<Link href="...">` (prefetch, soft navigation).
- External URLs → `<a target="_blank" rel="noopener noreferrer">`.
- Imperative navigation (auth flows) → `useRouter().push()` (Day 10).

## Verify
- `Link` from `next/link` used on job details page for `/jobs` back link.
- Job cards link to `/jobs/<id>` without full page reload.
- No raw `<a href="/jobs">` for in-app navigation in core job flows.
- Jobs listing navigates to `/jobs/<id>` without full reload.
- No internal routes use raw `<a href="/...">` for in-app navigation in core job flows.

## Outcome

Internal navigation uses `next/link` for prefetch and soft transitions between home, jobs list, and job details.

## Notes / Gaps

- `NavbarLinks` is a client component (needs `usePathname`) — added Day 5.
- Active link styling (`pathname.startsWith("/jobs")`) is later polish.
- Admin sidebar uses `Link` similarly in `AdminSidebar.tsx` (Day 5).

## Next

[Lecture 27 - Project Milestone: Core Routes](./lecture-027-project-milestone-core-routes.md)
