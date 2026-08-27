# Lecture 11 - Day (2) Plan | خطة اليوم الثاني

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

## Implementation steps

### Step 1 — Recap Day 1 deployment
- Review the default App Platform URL from Day 1 deployment.
- The app is live, but users reach it via a platform-generated hostname—not a branded domain.

### Step 2 — Define Day 2 goal
- Day 2 goal: users reach the app via `wazifa.app` and `admin.wazifa.app` with HTTPS.
- Important: this is mostly **external ops**—registrar, Cloudflare, and DigitalOcean dashboards—not codebase changes.

### Step 3 — Review the lecture sequence
- Review the Day 2 arc:
  1. Domain concept (Lecture 12)
  2. Purchase (Lecture 13)
  3. DNS records (Lecture 14)
  4. Cloudflare nameservers (Lecture 15)
  5. Connect to DigitalOcean (Lecture 16)
  6. HTTPS verify (Lecture 17)
  7. Recap (Lecture 18)

### Step 4 — Review target hostnames and code preview
- Target hostnames: `wazifa.app` (public) and `admin.wazifa.app` (admin).
- Inspect `proxy.ts` briefly to preview where hostname constants will live (added Day 4):

```5:6:proxy.ts
const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
const PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"];
```

- Note: `dev.wazifa.app` and `dev-admin.wazifa.app` are staging hosts added **Day 7**, not Day 2.

### Step 5 — Set expectations and close
- No git commits expected on Day 2—all work is registrar, Cloudflare, and DigitalOcean configuration.
- Verification happens in DNS dashboards and browser, not in the repository.
- Next: Lecture 12 (What is a Domain).

## Verify
- [ ] Day 2 scope is infrastructure, not application code.
- [ ] Target hostnames `wazifa.app` and `admin.wazifa.app` are named.
- [ ] `proxy.ts` host constants are previewed (enforcement arrives Day 4).
- [ ] Staging subdomains are noted as a Day 7 addition.
- [ ] Lecture sequence 12–18 is clear.

## Outcome

- Clear map of Day 2: domain purchase → DNS → Cloudflare → DigitalOcean → HTTPS.
- No code changes; planning and orientation only.

## Notes / Gaps

- No git commits on Day 2; all work is registrar, Cloudflare, and DigitalOcean configuration.
- Staging subdomains (`dev.wazifa.app`, `dev-admin.wazifa.app`) were added Day 7—not Day 2.
- Exact DNS record values should be verified in live Cloudflare/DO accounts.

## Next

[Lecture 12 — What is a Domain](./lecture-012-what-is-a-domain.md)
