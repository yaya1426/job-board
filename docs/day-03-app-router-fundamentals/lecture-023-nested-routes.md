# Lecture 23 - Nested Routes | المسارات المتداخلة

## Goal

Folder nesting creates URL nesting: `/jobs` is a child of `/` in the filesystem and in the browser path.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `app/(client)/page.tsx` — `/`
- `app/(client)/jobs/page.tsx` — `/jobs`
- `app/(client)/jobs/[id]/page.tsx` — `/jobs/:id`
- `app/layout.tsx` — ancestor layout for all nested routes

## What Was Built

A `jobs` folder under the app router with its own `page.tsx`, producing the `/jobs` URL without a separate router config file. Nesting `jobs/[id]/page.tsx` adds a second segment. The root layout wraps every nested page automatically.

## Implementation steps

### Step 1: Map the nested folder tree

```
app/
├── layout.tsx
├── page.tsx                 → /
└── jobs/
    ├── page.tsx             → /jobs
    └── [id]/
        └── page.tsx         → /jobs/:id   (next lecture)
```

Today's repo equivalent: `app/(client)/jobs/page.tsx` (route group added Day 4).

### Step 2: Create home page — `app/page.tsx`

On Day 3, create at `app/page.tsx` (now `app/(client)/page.tsx`). Start with a minimal Server Component:

```tsx
function Home() {
  return (
    <main className="p-8">
      <h1>WAZIFA_</h1>
      <p>Find your next role.</p>
    </main>
  );
}

export default Home;
```

Today's file fetches jobs via `getJobs()` — that wiring comes in Day 8.

### Step 3: Create jobs listing — `app/jobs/page.tsx`

```bash
mkdir -p app/jobs
```

```tsx
// app/jobs/page.tsx — Day 3 placeholder
function JobsPage() {
  return (
    <main className="p-8">
      <h1>ALL POSITIONS</h1>
      <p>Jobs listing coming soon.</p>
    </main>
  );
}

export default JobsPage;
```

Current repo (`app/(client)/jobs/page.tsx`) uses `JobsListingWrapper` and `getJobs()`.

### Step 4: Confirm URL nesting

- `/` → `app/page.tsx` (one segment).
- `/jobs` → `app/jobs/page.tsx` (two segments: root + `jobs`).
- No `app/jobs.tsx` file — folder + `page.tsx` is required.

### Step 5: Verify inheritance from root layout

Navigate to `/jobs` — same `<html>`, fonts, and `globals.css` as home. Nested routes inherit parent `layout.tsx` automatically.

## Verify
- `app/jobs/page.tsx` exists (or `app/(client)/jobs/page.tsx` after Day 4 move).
- Browser `/jobs` renders the jobs page.
- Parent `app/layout.tsx` still wraps the jobs page.
- `app/(client)/jobs/page.tsx` exists.
- Browser `/jobs` renders the jobs listing.
- Parent `app/layout.tsx` still wraps the jobs page (shared html/body).

## Outcome

Nested folders produce nested URLs: `/jobs` and `/jobs/[id]` inherit the root layout without a separate router config file.

## Notes / Gaps

- Day 3 originally used `app/jobs/` without the `(client)` group.
- Client layout (`app/(client)/layout.tsx`) with navbar/footer is Day 5 — Day 3 pages rendered without that shell.
- Jobs page now uses `JobsListingWrapper` and `getJobs()` service (Day 8+).

## Next

[Lecture 24 - Dynamic Routes](./lecture-024-dynamic-routes.md)
