# Lecture 51 - Client: Job Details Page

## Goal

Build the dynamic job details page at `/jobs/[id]` with full description and an apply-form area (placeholder on Day 6).

## Implementation Status

**Complete and extended.** Core layout (`JobDescription`, `JobNotFound`) from Day 6 remains. Later days added auth-aware apply (`JobApplyForm`, `ApplyAuthPrompt`, `ApplicationSubmitted`) and service-backed data.

## Key Files (as implemented today)

- `app/(client)/jobs/[id]/page.tsx`
- `components/jobs/JobDescription.tsx`
- `components/jobs/JobNotFound.tsx`
- `components/jobs/JobApplyForm.tsx` (evolved Day 8+)
- `services/jobs/jobs.service.ts` — `getJob(id)`

## What Was Built

- Dynamic route `jobs/[id]/page.tsx` reading `params.id`.
- Two-column layout: job description left, apply panel right.
- `JobNotFound` for missing IDs.
- Apply form UI shell (fields prefilled later on Day 10).

## Implementation steps

### Step 1: Create the dynamic job route

Create `app/(client)/jobs/[id]/page.tsx`. Read `params.id` (typed `Promise<{ id: string }>` in current Next.js). On Day 6, look up the job in `JobsData` by id.

### Step 2: Build JobNotFound

Build `components/jobs/JobNotFound.tsx` — render when no job matches the id.

### Step 3: Build JobDescription

Build `components/jobs/JobDescription.tsx` — display title, company, location, type, salary, tags, description, and requirements list from a `job: Job` prop.

### Step 4: Add apply panel placeholder

Add a two-column layout: `JobDescription` (left, `lg:col-span-2`) and an apply panel (right). On Day 6, use a static `JobApplyForm` shell with fields: name, email, LinkedIn, cover letter, resume placeholder — no Server Action yet.

### Step 5: Add back link to jobs list

Add a back link to `/jobs` above the grid.

## Verify
```bash
git log --oneline --grep="Day 6: Job Details"
# -> 532573e Day 6: Job Details Page
- `getJob(id)` called in `app/(client)/jobs/[id]/page.tsx`.
- Invalid id renders `JobNotFound`.
- Apply panel branches on auth state (post–Day 10); Day 6 end-state shows static form only.

## Outcome

`/jobs/[id]` shows full job details and an apply area. Day 6 end-state is a static apply form; **current repo** adds auth-aware apply, `getCurrentUserProfile()`, and service-backed `getJob()`.

## Notes / Gaps

- Current repo is ahead of Day 6 end-state for apply/auth/screening. For Day 6 historical context, document the simpler placeholder form.
- `params` is typed as `Promise<{ id: string }>` (Next.js 15+ async params pattern).

## Next

[Lecture 52 - Admin: Dashboard Page](./lecture-052-admin-dashboard-page.md)
