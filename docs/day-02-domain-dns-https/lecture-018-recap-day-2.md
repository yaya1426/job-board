# Lecture 18 - Recap Day (2) | ملخص اليوم الثاني

## Goal

Consolidate Day 2: explain the full path from domain purchase to HTTPS URL and how it connects to the Day 1 deployment.

## Implementation Status

External/ops only (hostname routing in `proxy.ts` codified Day 4; staging subdomains Day 7).

## Key Files (as implemented today)

- `proxy.ts` — `PUBLIC_HOSTS` and `ADMIN_HOSTS`
- `Dockerfile` / App Platform deployment (Day 1)
- `docs/day-02-domain-dns-https/README.md`

## What Was Built

- Production infrastructure layer complete for initial launch:
  - Registered domain `wazifa.app`.
  - Cloudflare DNS management with nameserver delegation.
  - Custom domains on DigitalOcean App Platform.
  - HTTPS verified on public and admin hostnames.
- Application still simple from Day 1—infra ahead of features by design.

## Implementation steps

### Step 1 — Recap the full Day 2 chain
- Trace the request path: browser → DNS → Cloudflare → DigitalOcean container → Next.js.
- Recap the operational sequence: registrar → Cloudflare DNS → DO App Platform → HTTPS.
- Production app = code + hosting + DNS + TLS—not code alone.

### Step 2 — Review both URLs side by side
- Load `https://wazifa.app` and `https://admin.wazifa.app` in the browser.
- Confirm both serve the deployed Next.js app over HTTPS.
- Note: until Day 4, both may show identical content—routing not yet implemented in `proxy.ts`.

### Step 3 — Cross-check codebase constants
- Inspect `proxy.ts` and confirm production hostnames:

```5:6:proxy.ts
const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
const PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"];
```

- Note: `dev.wazifa.app` and `dev-admin.wazifa.app` are staging hosts added **Day 7**.

### Step 4 — Note what Day 2 did not change
- No git commits today—ops work is equally part of shipping.
- Application is still the simple Day 1 page—infra ahead of features by design.
- Database, auth, and real product pages come on later days.

### Step 5 — Preview upcoming days and close
- Day 3 preview: App Router fundamentals inside the codebase.
- Day 4 preview: `proxy.ts` will split public vs admin by hostname.
- Day 7 preview: staging subdomains and branch workflow.
- Document DNS record values for future reference.

## Verify
- [ ] `https://wazifa.app` and `https://admin.wazifa.app` load the deployed app securely.
- [ ] You can explain the full path: purchase → DNS → Cloudflare → DO → HTTPS.
- [ ] `proxy.ts` shows production hostnames in `PUBLIC_HOSTS` / `ADMIN_HOSTS`.
- [ ] DNS record values are documented.
- [ ] Staging subdomains arrive Day 7.

## Outcome

- Day 2 infrastructure layer complete:
  - Registered domain `wazifa.app`.
  - Cloudflare DNS with nameserver delegation.
  - Custom domains on DigitalOcean App Platform.
  - HTTPS verified on public and admin hostnames.
- Application unchanged from Day 1—ready for Day 3 codebase work.

## Notes / Gaps

- Until Day 4, both hostnames may show identical content—routing not yet implemented.
- Staging environment and branch workflow arrive Day 7.
- Database, auth, and real product pages come on later days—infra is ready first.

## Next

Day 3 begins with App Router fundamentals in `docs/day-03-app-router-fundamentals/`.
