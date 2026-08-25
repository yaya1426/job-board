# Lecture 28 - Ship It: Deploy Checkpoint | نقطة نشر اليوم

## Goal

Deploy the Day 3 routing milestone to the staging/production URL and verify the three routes work on the real host, not just localhost.

## Implementation Status

External (deployment workflow; routes Implemented in repo)

## Key Files (as implemented today)

- `Dockerfile` — container build (present from Day 1+)
- `next.config.ts` — `output: "standalone"`
- `.github/` or DigitalOcean App Platform config (if used for CI/deploy)

## What Was Built

Students pushed Day 3 work through the course branch workflow and confirmed `dev.wazifa.app` (or production) serves `/`, `/jobs`, and `/jobs/<id>`. This reinforces "ship from day 1" — routing is worthless to stakeholders until it runs on a real URL.

## Recording Outline

- State the checkpoint: deploy what you have, even if UI is minimal.
- Merge/push via the course branch rules (`feature/*` → `development` → production as applicable).
- Trigger DigitalOcean deploy (or show dashboard build in progress).
- Open `dev.wazifa.app` and click through all three routes.
- Test one dynamic job URL on the deployed host.
- Compare localhost vs deployed behavior (should match for static routing).
- Note common deploy failures: build errors, missing env vars (less relevant for pure routing day).
- Emphasize habit: every milestone gets a real URL verification.
- Transition to Day 3 recap.

## Verify in Repo

- Latest commit includes Day 3 route files.
- Deploy succeeds on App Platform (or document if student env differs).
- Public staging URL loads home and `/jobs` without 404.

## Notes / Gaps

- Day 3 deploy had no MongoDB dependency for routing itself; later days require `MONGO_URI`.
- Subdomain routing (`admin.wazifa.app`) is Day 4 — only public host matters here.
- `force-dynamic` layouts came later for Mongoose; Day 3 may have been statically prerender-friendly.

## Next

[Lecture 29 - Recap Day 3](./lecture-029-recap-day-3.md)
