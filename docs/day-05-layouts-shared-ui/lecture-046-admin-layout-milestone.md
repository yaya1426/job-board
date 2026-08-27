# Lecture 46 - Project Milestone: Apply Layout for Admin Pages | معلم تخطيط صفحات الإدارة

## Goal

Ship the admin dashboard shell: sidebar navigation, main content area, and consistent layout across all `/dashboard/*` routes.

## Implementation Status

Implemented (layout + sidebar); Partial (auth guard and users link added later)

## Key Files (as implemented today)

- `app/(admin)/dashboard/layout.tsx`
- `components/navbar/AdminSidebar.tsx`
- All `app/(admin)/dashboard/**/page.tsx` admin routes

## What Was Built

Commit `0e46b8a` ("Day 5: Admin Layout") added the dashboard layout with `AdminSidebar`. Sidebar links cover OVERVIEW, JOB POSTS, APPLICATIONS, and USERS (users link/target added Day 6). Inverted colors (`bg-foreground text-background`) distinguish admin from public shell.

## Implementation steps

### Step 1: Create `app/(admin)/dashboard/layout.tsx`

Day 5 version (no auth guard):

```tsx
import AdminSidebar from "@/components/navbar/AdminSidebar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}

export default DashboardLayout;
```

Today's file adds `getCurrentUser()` + redirect (Day 10).

### Step 2: Build `AdminSidebar`

```9:14:components/navbar/AdminSidebar.tsx
const adminLinks = [
  { to: "/dashboard", label: "OVERVIEW", icon: LayoutGrid },
  { to: "/dashboard/jobs", label: "JOB POSTS", icon: Briefcase },
  { to: "/dashboard/applications", label: "APPLICATIONS", icon: FileText },
  { to: "/dashboard/users", label: "USERS", icon: Users },
];
```

USERS link added Day 6 when `users/page.tsx` ships.

### Step 3: Style active route

```34:49:components/navbar/AdminSidebar.tsx
        {adminLinks.map((link) => {
          const isActive = pathname === link.to;
          return (
            <Link
              key={link.to}
              href={link.to}
              className={`flex items-center gap-3 px-6 py-4 font-heading text-sm font-bold transition-none border-l-4 ${
                isActive
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-transparent hover:border-accent hover:bg-accent/5"
              }`}
            >
```

Client component — needs `"use client"` + `usePathname()`.

### Step 4: Apply inverted admin colors

```24:24:components/navbar/AdminSidebar.tsx
    <aside className="w-64 min-h-screen bg-foreground text-background brutal-border border-t-0 border-l-0 border-b-0 flex-shrink-0 flex flex-col">
```

Admin shell is visually distinct from the public white-background layout.

### Step 5: Verify all Day 4 admin routes render inside layout

On `dev-admin.wazifa.app`, navigate between `/dashboard`, `/dashboard/jobs`, `/dashboard/applications` — sidebar persists, only `<main>` content swaps.

## Verify
- `AdminSidebar` lists dashboard, jobs, applications routes.
- `app/(admin)/dashboard/layout.tsx` wraps `{children}` in `<main>`.
- Sidebar persists when navigating between admin pages.

## Outcome

Ship the admin dashboard shell: sidebar navigation, main content area, and consistent layout across all `/dashboard/*` routes.

## Notes / Gaps

- Current layout redirects unauthenticated/non-admin users (Day 10) — open on Day 5.
- `AdminSidebar` brand link `href="/admin"` may not match proxy routes — minor inconsistency.
- Resume download route `applications/[id]/resume/route.ts` is Day 11 — no sidebar change needed.

## Next

[Lecture 47 - Recap Day (5)](./lecture-047-recap-day-5.md)
