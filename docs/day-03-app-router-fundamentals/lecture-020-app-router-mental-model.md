# Lecture 20 - App Router Mental Model | النموذج الذهني لـ App Router

## Goal

Teach the core App Router idea: the `app/` directory is the router; folders are URL segments; special files (`page`, `layout`, `loading`, etc.) define behavior.

## Implementation Status

Implemented (concepts); Partial (special files like `loading.tsx` not used yet on these routes)

## Key Files (as implemented today)

- `app/` — router root
- `app/layout.tsx` — root layout wrapping every route
- `app/(client)/page.tsx` — `/`
- `app/(client)/jobs/page.tsx` — `/jobs`
- `app/(client)/jobs/[id]/page.tsx` — `/jobs/:id`

## What Was Built

On Day 3, Next.js resolves URLs by traversing the `app/` tree. A `page.tsx` file at a folder level creates a publicly reachable route. Parent `layout.tsx` files wrap child pages. Route groups like `(client)` came later and do not affect the URL.

## Implementation steps

### Step 1: Inspect `app/` and name it the router

In the repo root, `app/` is the route table—not a components dump.

### Step 2: Map URLs to folders (current repo)

| URL | File today | Day 3 historical path |
|-----|------------|----------------------|
| `/` | `app/(client)/page.tsx` | `app/page.tsx` |
| `/jobs` | `app/(client)/jobs/page.tsx` | `app/jobs/page.tsx` |
| `/jobs/:id` | `app/(client)/jobs/[id]/page.tsx` | `app/jobs/[id]/page.tsx` |

Route groups like `(client)` are invisible in the URL (added Day 4).

### Step 3: Identify special files used on Day 3

- `layout.tsx` — shared shell (root wraps everything).
- `page.tsx` — makes a segment publicly reachable.

Not built on this day: `loading.tsx`, `error.tsx`, `not-found.tsx`.

### Step 4: Review the root layout wraps all pages

```21:34:app/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

Day 3 version was simpler (no `SessionProvider` — that is Day 10). The `{children}` slot is where nested layouts and pages render.

### Step 5: Define the Server Component default

Review any `page.tsx` under `(client)` — no `"use client"` at the top. App Router pages are Server Components unless marked otherwise.

## Verify
- You can draw URL → folder mapping for `/`, `/jobs`, `/jobs/[id]`.
- `page.tsx` publishes a route and `layout.tsx` wraps it.
- `(client)` is named as a later organizational move, not a URL segment.
- `app/layout.tsx` exists and wraps `{children}`.
- `app/(client)/jobs/page.tsx` resolves to `/jobs` on the public host.
- `app/(client)/jobs/[id]/page.tsx` resolves to `/jobs/<id>`.

## Outcome

You can map URLs to folders under `app/`, name the special files used on Day 3 (`page.tsx`, `layout.tsx`), and explain how the root layout wraps nested routes.

## Notes / Gaps

- Current job pages call services and render rich components; Day 3 pages were minimal placeholders.
- `app/(admin)/`, `app/(auth)/`, and `app/api/` exist now but are out of scope for Day 3.
- Root layout now includes `SessionProvider` (Day 10); Day 3 root layout was simpler.

## Next

[Lecture 21 - App Router vs Pages Router](./lecture-021-app-router-vs-pages-router.md)
