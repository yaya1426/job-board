# Day 6 - Product UI with Mock Data

## Goal

Build out the visible product experience using mock data: landing page, jobs list, job details, admin dashboard, job management, applications, and users.

## Lectures Covered

- Lecture 48 - Day 6 Plan
- Lecture 49 - Home Page
- Lecture 50 - Client: Jobs List Page
- Lecture 51 - Client: Job Details Page
- Lecture 52 - Admin: Dashboard Page
- Lecture 53 - Admin: Jobs Management Page
- Lecture 54 - Admin: Create New Job Page
- Lecture 55 - Admin: Edit & Delete Job
- Lecture 56 - Admin: Applications Page
- Lecture 57 - Admin: Users Page
- Lecture 58 - Recap Day 6

## Commit Evidence

Commits found for this day:

- `1dfd33f` - Day 6: Home Page UI (Landing)
- `0b43ff9` - Day 6: Jobs Listing Page UI
- `532573e` - Day 6: Job Details Page
- `434db60` - Day 6: Create New Job Listing Page
- `247e906` - Day 6: Edit & Delete Job Listing
- `cf73974` - Day 6: Applications Page
- `6b4175f` - Day 6: Users UI

Key files added/changed:

- `data/JobsData.ts`
- `data/ApplicationsData.ts`
- `data/CandidateData.ts`
- `types/Job.ts`
- `types/Application.ts`
- `types/Candidate.ts`
- `types/StatusFilters.ts`
- `components/landing/*`
- `components/jobs/*`
- `components/job-management/*`
- `components/applications/*`
- `components/users/*`
- `components/dashboard/*`
- `context/jobs/*`
- `context/applications/*`
- `context/users/*`
- `utils/getCandidate.ts`
- `utils/getCandidateApplications.ts`

## Final State

By the end of the day, the app looked like a real product while still using mock data.

Client side:

- Landing page with hero and featured jobs.
- Jobs listing page.
- Job details page.
- Apply form component placeholder.

Admin side:

- Dashboard overview.
- Job management table.
- Create job form.
- Edit job form.
- Delete confirmation popup.
- Applications dashboard and table.
- Users/candidates page.

State/data:

- Mock data files backed the UI.
- Context providers were added for jobs, applications, and users.
- Domain types started to become explicit in `types/`.

## Architecture Decisions

- The UI was intentionally built before persistence. This gave the course a product surface to later refactor toward services, repositories, and MongoDB.
- Domain types were introduced early, even while data was still mocked.
- Context providers were used as a client-side bridge over mock data before server-side services became the source of truth.

## Teaching Narrative

This day is the "make it feel real" day. It is less about backend correctness and more about giving students a complete product surface they can later harden.

The teaching value is that backend architecture will be motivated by an existing UI that already needs data.

## Notes

- `JobsData.ts` and `ApplicationsData.ts` were later removed when Day 9 moved jobs/applications into MongoDB.
- `CandidateData.ts` remains live as a deliberate mock until Day 11+.
