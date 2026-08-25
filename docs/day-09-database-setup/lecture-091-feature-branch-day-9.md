# Lecture 091 - Feature Branch for Day 9 | برانش ميزة اليوم التاسع

## Goal

Ship Day 9 work through the course branching model: `feature/day-9-*` → `development` → `production`, with staging subdomains for verification before release.

## Explain It Simply (For Beginners)

A **feature branch** is a short-lived git branch where one day's work happens without breaking the stable staging app.

For Day 9:

1. Branch from `development`
2. Implement database + repositories + apply flow
3. Open PR to `development`
4. Verify on `dev.wazifa.app` and `dev-admin.wazifa.app`
5. Merge to `development`, then promote to `production` when ready

## Recording Steps

1. `git checkout development && git pull`
2. `git checkout -b feature/day-9-database-setup`
3. Commit in logical chunks matching lectures (connection, models, repositories, apply flow, caching fix).
4. Push and open a PR with:
   - Summary of MongoDB integration
   - Note that `MONGO_URI` must exist on DigitalOcean with **build and run** scope
5. Deploy preview / staging and test:
   - Create a job
   - Apply to it
   - See application in admin
6. Merge after review.

## Environment Checklist for Reviewers

- [ ] `MONGO_URI` set locally and on DigitalOcean
- [ ] Database name in URI matches expected DB
- [ ] Atlas network access allows deploy environment
- [ ] Dockerfile builder stage receives `MONGO_URI` (Lecture 092)

## Key Teaching Lines

> Database features are not done until they work on staging with real Atlas, not just localhost.

> One feature branch per day keeps the course history teachable.

## End State

Day 9 changes follow the team workflow and are verifiable on staging before production.

## Next

Lecture 092 fixes Next.js caching so DB-backed pages are not statically frozen at build time.
