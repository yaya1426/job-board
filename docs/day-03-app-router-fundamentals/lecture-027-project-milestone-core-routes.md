# Lecture 27 - Project Milestone: Core Routes | معلم المسارات الأساسية

## Goal

Complete the Day 3 routing milestone: home (`/`), jobs list (`/jobs`), and dynamic job details (`/jobs/[id]`) working end-to-end in the deployed app.

## Implementation Status

Implemented (routes exist; current pages evolved with DB, layouts, and apply flow in later days)

## Key Files (as implemented today)

- `app/(client)/page.tsx`
- `app/(client)/jobs/page.tsx`
- `app/(client)/jobs/[id]/page.tsx`
- `app/layout.tsx`

## What Was Built

Commit `1a56240` ("Day 3: Core Routes for Jobs") added the three public routes. Originally at `app/page.tsx`, `app/jobs/page.tsx`, and `app/jobs/[id]/page.tsx`. Students verified all three URLs locally and confirmed navigation between them.

## Recording Outline

- Recap the three routes and their file paths (historical vs current `(client)` paths).
- Walk through home → jobs list → one job detail → back link.
- Show folder structure side-by-side with browser URLs.
- Run `git show 1a56240 --stat` to anchor the milestone in version history.
- Confirm each route has a `page.tsx` and inherits root layout.
- Sanity-check dynamic route with at least two different ids in the URL bar.
- Discuss what's intentionally **not** built yet: admin, auth, database, styled shell.
- Celebrate: this is the first product-shaped routing skeleton, not a demo counter app.
- Prepare for deploy checkpoint next.

## Verify in Repo

- All three routes resolve on `localhost:3000`.
- `git log --oneline` includes `1a56240` or equivalent Day 3 commit message.
- Current paths under `app/(client)/` mirror original Day 3 URLs.

## Notes / Gaps

- Pages now load jobs from MongoDB via services — Day 3 may have used static placeholders.
- Client layout/navbar (Day 5) and auth (Day 10) significantly changed the visual experience.
- Route group move `(client)` happened Day 4–5; URLs unchanged.

## Next

[Lecture 28 - Ship It: Deploy Checkpoint](./lecture-028-ship-it-deploy-checkpoint.md)
