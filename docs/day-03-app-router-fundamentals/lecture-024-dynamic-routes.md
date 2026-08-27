# Lecture 24 - Dynamic Routes | المسارات الديناميكية

## Goal

Introduce dynamic URL segments with bracket folders (`[id]`) so one page component can render many job detail URLs.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `app/(client)/jobs/[id]/page.tsx` — dynamic job details route
- `app/(client)/jobs/page.tsx` — listing that links into dynamic routes

## What Was Built

`app/jobs/[id]/page.tsx` (now `app/(client)/jobs/[id]/page.tsx`). The `[id]` folder name creates a dynamic segment: `/jobs/abc123` and `/jobs/xyz789` both hit the same page file with different param values.

## Implementation steps

### Step 1: Create the dynamic segment folder

```bash
mkdir -p app/jobs/[id]
```

Bracket syntax `[id]` tells Next.js this segment is dynamic, not a literal folder name in the URL.

### Step 2: Add `page.tsx` inside `[id]`

Start with a Day 3 placeholder that reads the param (full pattern in Lecture 25):

```tsx
// app/jobs/[id]/page.tsx — Day 3 skeleton
type Props = {
  params: Promise<{ id: string }>;
};

async function JobDetailsPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="p-8">
      <h1>JOB DETAILS</h1>
      <p className="font-mono text-sm">ID: {id}</p>
    </main>
  );
}

export default JobDetailsPage;
```

### Step 3: Test multiple URLs

Inspect `/jobs/test-id-1` and `/jobs/test-id-2` — same component, different `id` in the UI.

### Step 4: Contrast static vs dynamic segments

| Segment | Folder | Example URL |
|---------|--------|-------------|
| Static | `jobs/` | `/jobs` |
| Dynamic | `[id]/` | `/jobs/abc123` |

### Step 5: Preview admin dynamic routes (Day 4+)

Admin uses the same mechanic with different param names:

- `app/(admin)/dashboard/jobs/[jobId]/edit/page.tsx` → `/dashboard/jobs/:jobId/edit`
- `app/(admin)/dashboard/applications/[applicationId]/page.tsx` → `/dashboard/applications/:id`

## Verify
- Folder `app/jobs/[id]/` (or `app/(client)/jobs/[id]/`) exists with `page.tsx`.
- Navigating to `/jobs/any-string` renders the details page with that id.
- One file scales to N jobs.
- Folder `app/(client)/jobs/[id]/` exists with `page.tsx`.
- Navigating to `/jobs/<valid-id>` renders job details (with DB-backed data today).
- Invalid id shows `JobNotFound` component (added in later days; Day 3 may have been simpler).

## Outcome

Bracket folders (`[id]`) create dynamic segments—one page component serves many job detail URLs.

## Notes / Gaps

- Admin uses `[jobId]` and `[applicationId]` naming — different param names, same dynamic-route mechanic.
- `jobs/[jobId]/page.tsx` under admin was removed in a later refactor; edit route remains.
- Current page is much richer (apply form, auth prompt) than Day 3 placeholder.

## Next

[Lecture 25 - Route Params](./lecture-025-route-params.md)
