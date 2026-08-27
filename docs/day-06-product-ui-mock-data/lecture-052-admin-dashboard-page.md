# Lecture 52 - Admin: Dashboard Page

## Goal

Build the admin dashboard overview at `/dashboard` with headline stats and a recent-applications panel.

## Implementation Status

**Complete.** Dashboard page and stat components exist. Data now comes from `getJobs()` and `getApplications()` services.

## Key Files (as implemented today)

- `app/(admin)/dashboard/page.tsx`
- `components/dashboard/DashboardStats.tsx`
- `components/dashboard/RecentApplications.tsx`
- `app/(admin)/dashboard/layout.tsx`

## What Was Built

- Admin home route showing active jobs count, total applications, average AI score, interview count.
- `RecentApplications` table/list from application mock data (Day 6).
- Uses admin layout with sidebar from Day 5.

## Implementation steps

### Step 1: Open the dashboard page

Inspect `app/(admin)/dashboard/page.tsx` inside the admin route group. On Day 6, import `JobsData` and `ApplicationsData` directly.

### Step 2: Compute overview aggregates

Compute aggregates: `activeJobs = jobs.length`, `totalCandidates = applications.length`, `interviews = applications.filter(c => c.status === "INTERVIEW").length`, `avgScore = (sum of aiScore / count).toFixed(1)`.

### Step 3: Build DashboardStats

Build `components/dashboard/DashboardStats.tsx` — four stat cards receiving `activeJobs`, `totalCandidates`, `avgScore`, `interviews`.

### Step 4: Build RecentApplications

Build `components/dashboard/RecentApplications.tsx` — table or list of recent applications with status badges; accept `applications` prop.

### Step 5: Confirm admin layout chrome

Confirm `app/(admin)/dashboard/layout.tsx` from Day 5 provides sidebar chrome.

## Verify
- `app/(admin)/dashboard/page.tsx` imports `getJobs` and `getApplications`.
- `DashboardStats` receives `activeJobs`, `totalCandidates`, `avgScore`, `interviews`.
- `RecentApplications` receives `applications` array.
- No standalone "Day 6: Dashboard" commit; likely shipped with adjacent admin pages.

## Outcome

`/dashboard` shows overview stats and recent applications. Day 6 used mock arrays; **current repo** reads MongoDB via services. AI scores are real post–Day 11 screening; Day 6 values were static mock numbers.

## Notes / Gaps

- `avgScore` divides by `applications.length`; empty DB yields `NaN` — handle in demo or seed data.
- AI scores are real post–Day 11 screening; Day 6 mock values were static.

## Next

[Lecture 53 - Admin: Jobs Management Page](./lecture-053-admin-jobs-management-page.md)
