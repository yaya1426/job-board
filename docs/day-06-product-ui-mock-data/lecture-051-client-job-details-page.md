# Lecture 51 - Client: Job Details Page

## Goal

Build the dynamic job details page at `/jobs/[id]` with full description and an apply-form area (placeholder on Day 6).

## Implementation Status

**Complete and extended.** Core layout (`JobDescription`, `JobNotFound`) from Day 6 remains. Later days added auth-aware apply (`JobApplyForm`, `ApplyAuthPrompt`, `ApplicationSubmitted`) and service-backed data.

## Key Files

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

## Recording Outline

1. Explain dynamic segments and `params` in App Router.
2. Fetch a single job by id (mock lookup on Day 6).
3. Build `JobDescription` — title, company, location, type, salary, tags, requirements.
4. Add apply form placeholder (name, email, LinkedIn, cover letter, resume area).
5. Handle not-found with `JobNotFound`.

## Verify in Repo

```bash
git log --oneline --grep="Day 6: Job Details"
# -> 532573e Day 6: Job Details Page
```

- `getJob(id)` called in `app/(client)/jobs/[id]/page.tsx`.
- Invalid id renders `JobNotFound`.
- Apply panel branches on auth state (post–Day 10); Day 6 students see static form only.

## Notes/Gaps

- Current repo is ahead of Day 6 end-state for apply/auth/screening. When recording historically, show the simpler placeholder form.
- `params` is typed as `Promise<{ id: string }>` (Next.js 15+ async params pattern).

## Next

Lecture 052 — admin dashboard overview with stats and recent applications.
