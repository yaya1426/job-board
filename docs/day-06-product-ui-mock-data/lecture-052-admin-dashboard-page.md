# Lecture 52 - Admin: Dashboard Page

## Goal

Build the admin dashboard overview at `/dashboard` with headline stats and a recent-applications panel.

## Implementation Status

**Complete.** Dashboard page and stat components exist. Data now comes from `getJobs()` and `getApplications()` services.

## Key Files

- `app/(admin)/dashboard/page.tsx`
- `components/dashboard/DashboardStats.tsx`
- `components/dashboard/RecentApplications.tsx`
- `app/(admin)/dashboard/layout.tsx`

## What Was Built

- Admin home route showing active jobs count, total applications, average AI score, interview count.
- `RecentApplications` table/list from application mock data (Day 6).
- Uses admin layout with sidebar from Day 5.

## Recording Outline

1. Open admin route group and `/dashboard` page.
2. Compute simple aggregates from mock jobs + applications arrays.
3. Build `DashboardStats` four-up stat cards.
4. Build `RecentApplications` with status badges and links.
5. Navigate via `dev-admin.wazifa.app/dashboard` (or local with host header).

## Verify in Repo

- `app/(admin)/dashboard/page.tsx` imports `getJobs` and `getApplications`.
- `DashboardStats` receives `activeJobs`, `totalCandidates`, `avgScore`, `interviews`.
- `RecentApplications` receives `applications` array.
- No standalone "Day 6: Dashboard" commit; likely shipped with adjacent admin pages.

## Notes/Gaps

- `avgScore` divides by `applications.length`; empty DB yields `NaN` — handle in demo or seed data.
- AI scores are real post–Day 11 screening; Day 6 mock values were static.

## Next

Lecture 053 — admin jobs management table.
