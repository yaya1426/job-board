# Lecture 091 - Feature Branch for Day (9) | برانش ميزة اليوم التاسع

## Goal
Ship Day 9 work through the project branching model: `feature/day-9-*` → `development` → `production`, with staging subdomains for verification before release.

## Background
A **feature branch** is a short-lived git branch where one day's work happens without breaking the stable staging app.

For Day 9:

1. Branch from `development`
2. Implement database + repositories + apply flow
3. Open PR to `development`
4. Verify on `dev.wazifa.app` and `dev-admin.wazifa.app`
5. Merge to `development`, then promote to `production` when ready

## Implementation steps
1. `git checkout development && git pull`
2. `git checkout -b feature/day-9-database-setup`
3. Commit in lecture-sized chunks: connection → models → repositories → apply flow → aggregation → caching/Dockerfile.
4. Open PR to `development` noting `MONGO_URI` must have **build and run** scope on DigitalOcean.
5. Verify on `dev.wazifa.app` / `dev-admin.wazifa.app`: create job → apply → see application in admin.
6. Confirm Dockerfile builder stage has `ARG MONGO_URI` / `ENV MONGO_URI=$MONGO_URI` before merging.

## Environment Checklist for Reviewers
- [ ] `MONGO_URI` set locally and on DigitalOcean
- [ ] Database name in URI matches expected DB
- [ ] Atlas network access allows deploy environment
- [ ] Dockerfile builder stage receives `MONGO_URI` (Lecture 092)

## Key points
> Database features are not done until they work on staging with real Atlas, not just localhost.

> One feature branch per day keeps the project history teachable.

## End State
Day 9 changes follow the team workflow and are verifiable on staging before production.

## Next
Lecture 092 fixes Next.js caching so DB-backed pages are not statically frozen at build time.
