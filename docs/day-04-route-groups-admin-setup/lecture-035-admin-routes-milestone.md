# Lecture 35 - Project Milestone: Admin Routes | معلم مسارات الإدارة

## Goal

Ship the admin dashboard route tree: overview, jobs list, new job, job edit, applications list, and application detail.

## Implementation Status

Partial (core Day 4 routes Implemented; some original routes removed or added later)

## Key Files (as implemented today)

- `app/(admin)/dashboard/page.tsx` — `/dashboard`
- `app/(admin)/dashboard/jobs/page.tsx` — `/dashboard/jobs`
- `app/(admin)/dashboard/jobs/new/page.tsx` — `/dashboard/jobs/new`
- `app/(admin)/dashboard/jobs/[jobId]/edit/page.tsx` — `/dashboard/jobs/:jobId/edit`
- `app/(admin)/dashboard/applications/page.tsx` — `/dashboard/applications`
- `app/(admin)/dashboard/applications/[applicationId]/page.tsx` — `/dashboard/applications/:id`

## What Was Built

Commit `39d2362` ("Day 4: Admin Basic Routes") added placeholder admin pages. Day 4 originally also included `jobs/[jobId]/page.tsx` (job detail) and `applications/[applicationId]/review/page.tsx` — both removed in later refactors. `users/page.tsx` was added Day 6.

## Implementation steps

### Step 1: Scaffold dashboard overview

Create `app/(admin)/dashboard/page.tsx`:

```tsx
function DashboardPage() {
  return (
    <>
      <h1 className="text-4xl font-heading font-bold">OVERVIEW</h1>
      <p className="font-mono text-sm text-muted-foreground mt-1">
        ADMIN DASHBOARD
      </p>
    </>
  );
}

export default DashboardPage;
```

Today's file loads stats via `getJobs()` / `getApplications()` (Day 8+).

### Step 2: Add jobs subtree

| File | URL |
|------|-----|
| `app/(admin)/dashboard/jobs/page.tsx` | `/dashboard/jobs` |
| `app/(admin)/dashboard/jobs/new/page.tsx` | `/dashboard/jobs/new` |
| `app/(admin)/dashboard/jobs/[jobId]/edit/page.tsx` | `/dashboard/jobs/:jobId/edit` |

Day 4 also had `jobs/[jobId]/page.tsx` (standalone job detail) — **removed** in a later refactor. Edit route remains.

### Step 3: Add applications subtree

| File | URL |
|------|-----|
| `app/(admin)/dashboard/applications/page.tsx` | `/dashboard/applications` |
| `app/(admin)/dashboard/applications/[applicationId]/page.tsx` | `/dashboard/applications/:id` |

Day 4 also had `applications/[applicationId]/review/page.tsx` — **removed**. Review flow consolidated into the detail page.

### Step 4: Note routes added after Day 4

| File | Added |
|------|-------|
| `app/(admin)/dashboard/users/page.tsx` | Day 6 |
| `app/(admin)/dashboard/applications/[applicationId]/resume/route.ts` | Day 11 |

### Step 5: Verify on admin subdomain

On `dev-admin.wazifa.app`:

1. `/` → redirects to `/dashboard` (proxy Case 2).
2. `/dashboard/jobs` → jobs list placeholder.
3. `/dashboard/applications` → applications list placeholder.

```bash
git show 39d2362 --stat
```

## Verify
- All listed admin `page.tsx` files exist in current tree.
- `app/(admin)/dashboard/jobs/[jobId]/page.tsx` does **not** exist (removed).
- `.../applications/.../review/page.tsx` does **not** exist (removed).
- `dev-admin.wazifa.app/dashboard/jobs` loads (auth may block after Day 10).

## Outcome

Ship the admin dashboard route tree: overview, jobs list, new job, job edit, applications list, and application detail.

## Notes / Gaps

- Day 4 admin pages were placeholders; current pages use real services and components.
- Admin layout/sidebar (Day 5) and auth gate (Day 10) change the access experience.
- `AdminSidebar` link to `/admin` may not match proxy rules — minor later fix territory.

## Next

[Lecture 36 - Ship It: Deploy Checkpoint](./lecture-036-ship-checkpoint.md)
