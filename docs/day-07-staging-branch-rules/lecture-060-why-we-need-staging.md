# Lecture 60 - Why We Need Staging

## Goal

Explain why professional teams deploy to a staging environment before production: risk reduction, realistic testing, and shared review URLs.

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

## Recording Outline

1. Tell a failure story: pushing untested admin proxy change to prod.
2. Define staging vs local dev vs production.
3. Map wazifa.app four-host model on a slide.
4. List what staging catches that localhost misses (DNS, cookies, env vars, build).
5. Connect to course spiral: we will keep returning to deploy safety.

## Verify in Repo

- README "What Happened Outside the Repo" section acknowledges ops-heavy day.
- Both prod and dev hostnames referenced in `proxy.ts` `ADMIN_HOSTS` / `PUBLIC_HOSTS`.

## Notes/Gaps

- Staging DB should be separate from production MongoDB — verify Atlas cluster/database naming in DO env vars.
- No automated staging smoke tests yet in repo.

## Next

Lecture 061 — create development branch and DigitalOcean dev app.
