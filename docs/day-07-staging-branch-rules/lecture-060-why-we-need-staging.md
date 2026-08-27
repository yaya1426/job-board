# Lecture 60 - Why We Need Staging

## Goal
Document why professional teams deploy to a staging environment before production: risk reduction, realistic testing, and shared review URLs.

## Implementation Status
**Complete (conceptual).** `dev.wazifa.app` and `dev-admin.wazifa.app` are the project's staging surfaces.

## Key Files
- `docs/day-07-staging-branch-rules/README.md`
- Production: `wazifa.app`, `admin.wazifa.app`
- Staging: `dev.wazifa.app`, `dev-admin.wazifa.app`

## What Was Built
Conceptual framework — no code in this lecture:

- Staging mirrors production topology with separate data and URLs.
- Testers hit real HTTPS, cookies, and subdomain routing before users do.
- Broken staging is acceptable; broken production is not.

## Implementation steps
### Step 1

List what localhost cannot catch: real HTTPS, DNS, subdomain cookies, build-time env vars (`MONGO_URI` in Dockerfile), and DigitalOcean runtime config.

### Step 2

Define three environments for this project: local dev (`localhost:3000`), staging (`dev.*`), production (`wazifa.app` / `admin.wazifa.app`).

### Step 3

Document why staging mirrors production topology (same Dockerfile, same `proxy.ts` rules, separate MongoDB database).

### Step 4

Trace a failure scenario: pushing an untested proxy change directly to production breaks admin routing for all users.

### Step 5

Connect to the project spiral: deploy safety returns on every feature branch (Day 7 workflow, Day 8 PR, Day 10 auth proxy rules).

### Verify

- README "What Happened Outside the Repo" section acknowledges ops-heavy day.
- `proxy.ts` references both prod and dev hostnames in `ADMIN_HOSTS` / `PUBLIC_HOSTS`.

### End State

Defines **why** staging exists before any dashboard clicks. No code changes in this lecture — conceptual foundation for Lectures 061–064.

## Verify
- README "What Happened Outside the Repo" section acknowledges ops-heavy day.
- Both prod and dev hostnames referenced in `proxy.ts` `ADMIN_HOSTS` / `PUBLIC_HOSTS`.

## Notes/Gaps
- Staging DB should be separate from production MongoDB — verify Atlas cluster/database naming in DO env vars.
- No automated staging smoke tests yet in repo.

## Next
Lecture 061 — create development branch and DigitalOcean dev app.
