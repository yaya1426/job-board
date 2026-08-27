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

Day 5 established layout composition: root layout applies everywhere; group layouts add surface-specific UI without redefining `<html>`. Navigating between `/jobs` and `/` keeps navbar/footer mounted (client layout children swap). Admin pages share sidebar across `/dashboard/*`.

## Implementation steps

### Step 1: Draw the layout tree

```
app/layout.tsx                         ← <html>, <body>, globals.css, providers
├── (client)/layout.tsx                ← NavbarHeader + NavbarFooter
│   ├── page.tsx                       ← /
│   └── jobs/page.tsx                  ← /jobs
└── (admin)/dashboard/layout.tsx       ← AdminSidebar + <main>
    └── page.tsx                       ← /dashboard
```

### Step 2: Read root layout responsibilities

```21:34:app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

Root owns: `<html>`, `<body>`, fonts, global CSS, providers. **Not** navbar or sidebar.

### Step 3: Read client route-group layout

```7:14:app/(client)/layout.tsx
function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <NavbarHeader />
            {children}
            <NavbarFooter />
        </div>
    );
}
```

### Step 4: Read admin route-group layout

```19:24:app/(admin)/dashboard/layout.tsx
  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar currentUser={currentUser} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
```

Day 5: no auth guard. Day 10 adds `getCurrentUser()` + redirect.

### Step 5: Review layout persistence

Client-side navigation between `/` and `/jobs` swaps `{children}` only — navbar and footer stay mounted. Same for admin sidebar across `/dashboard/*`.

Anti-pattern: duplicating navbar markup in every `page.tsx`.

## Verify
- `app/(client)/layout.tsx` imports `NavbarHeader` and `NavbarFooter`.
- `app/(admin)/dashboard/layout.tsx` imports `AdminSidebar`.
- Navigating `/` → `/jobs` keeps header visible without full reload.

## Outcome

Documents nested layouts in the App Router: root layout vs route-group layouts, what persists across navigation, and where to put shared chrome.

## Notes / Gaps

- Dashboard layout now calls `getCurrentUser()` and redirects — Day 10 hardening.
- Auth layout `(auth)` removes public navbar for login/signup — post-Day 5.
- `SessionProvider` in root layout is Day 10.

## Next

[Lecture 45 - Project Milestone: Apply Layout for Client Pages](./lecture-045-client-layout-milestone.md)
