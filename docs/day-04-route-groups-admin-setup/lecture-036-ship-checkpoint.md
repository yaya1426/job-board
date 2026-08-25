# Lecture 36 - Ship It: Deploy Checkpoint | نقطة نشر اليوم

## Goal

Deploy Day 4 work — proxy rules, DNS, route groups, and admin routes — and verify both hostnames on staging.

## Implementation Status

External (deploy process); Implemented (code ready)

## Key Files (as implemented today)

- `proxy.ts`
- `app/(client)/` and `app/(admin)/dashboard/` route trees
- DigitalOcean + Cloudflare configuration

## What Was Built

Students merged Day 4 feature work, deployed to App Platform, and ran a hostname checklist: public site shows product routes only; admin subdomain lands on dashboard; cross-host redirects behave per proxy Cases 1–3.

## Recording Outline

- Pre-deploy checklist: `proxy.ts` committed, route groups in place, admin pages exist.
- Push to `development` branch per course workflow.
- Watch DigitalOcean build; confirm no proxy TypeScript errors.
- Test public host: `/`, `/jobs`, attempt `/dashboard` → redirect home.
- Test admin host: `/` → `/dashboard`, `/jobs` → `/dashboard`.
- Click through admin placeholder pages on staging.
- Check deploy logs if redirects misbehave.
- Document any DNS TTL delays for students.
- Emphasize modular monolith win: one deploy artifact, two products.
- Transition to Day 4 recap.

## Verify in Repo

- Latest branch includes `proxy.ts` and `(admin)` routes.
- Staging URLs pass hostname redirect matrix.
- No open redirect vulnerabilities from unchecked query params (out of scope but good awareness).

## Notes / Gaps

- Post-Day 10 deploy tests will also require admin login — not part of Day 4 checkpoint.
- Local dev testing of host rules remains limited without `/etc/hosts` tricks.
- Favicon/static exclusions must stay in matcher after deploy.

## Next

[Lecture 37 - Recap Day 4](./lecture-037-recap-day-4.md)
