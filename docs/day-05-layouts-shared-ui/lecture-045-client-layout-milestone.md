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

## Implementation steps

### Step 1: Create `app/(client)/layout.tsx`

```1:17:app/(client)/layout.tsx
import NavbarHeader from "@/components/navbar/NavbarHeader";
import NavbarFooter from "@/components/navbar/NavbarFooter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <NavbarHeader />
            {children}
            <NavbarFooter />
        </div>
    );
}

export default AppLayout;
```

Day 5: omit `dynamic`/`revalidate` exports (added later for MongoDB).

### Step 2: Build `NavbarHeader`

```5:19:components/navbar/NavbarHeader.tsx
const NavbarHeader = () => {
  return (
    <nav className="brutal-border border-t-0 border-x-0 bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-heading text-2xl font-bold tracking-tight">
          WAZIFA<span className="text-accent">_</span>
        </Link>
        <NavbarLinks />
        <NavbarAccount />
      </div>
    </nav>
  );
};
```

### Step 3: Build `NavbarLinks` (client component)

```1:40:components/navbar/NavbarLinks.tsx
"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "HOME" },
  { href: "/jobs", label: "BROWSE JOBS" },
];
// ... active state via pathname === link.href
```

Requires `"use client"` for `usePathname()`.

### Step 4: Build `NavbarFooter`

```1:12:components/navbar/NavbarFooter.tsx
function NavbarFooter() {
  return (
    <footer className="brutal-border border-x-0 border-b-0 bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <p className="font-heading text-sm font-bold">WAZIFA_ © {new Date().getFullYear()}</p>
        <p className="font-mono text-xs text-muted-foreground">BUILT WITH BRUTAL HONESTY</p>
      </div>
    </footer>
  );
}
```

### Step 5: Remove duplicate nav from individual pages

Verify `/`, `/jobs`, `/jobs/[id]` all show header + footer. Client navigation preserves layout (soft nav).

## Verify
- All files under `app/(client)/` inherit client layout automatically.
- `NavbarLinks` uses `Link` from `next/link` and highlights `/jobs` for nested routes (later fix).
- Footer appears on home and jobs pages.

## Outcome

Ship the public application shell: client route-group layout, top navigation, and footer across all `(client)` pages.

## Notes / Gaps

- `NavbarAccount` / `SignOutButton` are Day 10 — Day 5 may show static "LOG IN" links.
- Landing components (`HeroSection`, `FeaturedJobs`) enriched Day 6.
- Active link matching for `/jobs/[id]` may need `startsWith("/jobs")` — later polish.

## Next

[Lecture 46 - Project Milestone: Apply Layout for Admin Pages](./lecture-046-admin-layout-milestone.md)
