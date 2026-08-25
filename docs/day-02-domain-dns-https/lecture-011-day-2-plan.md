# Lecture 11 - Day 2 Plan | خطة اليوم الثاني

## Goal

Preview Day 2 as the infrastructure day: connect a real domain, DNS, Cloudflare, and HTTPS to the already-deployed App Platform app.

## Implementation Status

External/ops only (no Day 2 repository commits; domain routing constants appear later in `proxy.ts` on Day 4).

## Key Files (as implemented today)

- `proxy.ts` (Day 4 — `ADMIN_HOSTS` / `PUBLIC_HOSTS` domain constants)
- `Dockerfile` (unchanged deploy target for App Platform)
- `docs/day-02-domain-dns-https/README.md`

## What Was Built

- Day 2 is planning and orientation—no code changes in the repo.
- Operational target: `wazifa.app` (public) and `admin.wazifa.app` (admin) on production DNS.
- Cloudflare as DNS provider; DigitalOcean App Platform as compute host.
- HTTPS termination verified after domain connection.

## Recording Outline

- Recap Day 1: app is deployed on a default App Platform URL.
- State Day 2 goal: users reach the app via a real branded domain with HTTPS.
- Outline the lecture sequence: domain concept → purchase → DNS records → Cloudflare → DO connection → SSL verify → recap.
- Show the target hostnames: `wazifa.app` and `admin.wazifa.app`.
- Explain this is mostly outside the codebase—dashboards and DNS panels.
- Mention `dev.wazifa.app` and `dev-admin.wazifa.app` arrive on Day 7 staging.
- Preview `proxy.ts` (Day 4) as where hostname routing will be enforced in code.
- Set expectation: verify in Cloudflare/DO dashboards, not only in git.

## Verify in Repo

- Open `proxy.ts` and note `PUBLIC_HOSTS` and `ADMIN_HOSTS` constants (added Day 4).
- Confirm Day 2 README lists lectures 11–18 with no commit evidence.

## Notes / Gaps

- No git commits on Day 2; all work is registrar, Cloudflare, and DigitalOcean configuration.
- Staging subdomains (`dev.wazifa.app`, `dev-admin.wazifa.app`) were added Day 7—not Day 2.
- Exact DNS record values should be verified in live Cloudflare/DO accounts.

## Next

[Lecture 12 — What is a Domain](./lecture-012-what-is-a-domain.md)
