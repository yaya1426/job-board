# Lecture 33 - Configure Admin Sub-domain | إعداد النطاق الفرعي للإدارة

## Goal

Wire DNS so `admin.wazifa.app` and `dev-admin.wazifa.app` point to the same DigitalOcean app as the public site, enabling host-based routing.

## Implementation Status

External (Cloudflare DNS + App Platform domains); Partial (code side Implemented in `proxy.ts`)

## Key Files (as implemented today)

- `proxy.ts` — `ADMIN_HOSTS` / `PUBLIC_HOSTS` constants
- Cloudflare DNS dashboard (not in repo)
- DigitalOcean App Platform → Domains settings (not in repo)

## What Was Built

DNS configuration added CNAME (or ALIAS) records for admin subdomains in Cloudflare, attached both hostnames to the App Platform service, and confirmed HTTPS certificates provision. The app code already lists these hosts in `proxy.ts`; DNS makes them real.

## Implementation steps

### Step 1: Confirm host constants in code

```5:6:proxy.ts
const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
const PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"];
```

DNS records must resolve to the same DigitalOcean app as the public host.

### Step 2: Add Cloudflare DNS records

| Hostname | Type | Target |
|----------|------|--------|
| `dev-admin.wazifa.app` | CNAME | App Platform default hostname |
| `admin.wazifa.app` | CNAME | App Platform default hostname |

Staging first (`dev-admin`), production when ready.

### Step 3: Attach domains in DigitalOcean App Platform

Settings → Domains → add both admin hostnames alongside existing public domains.

### Step 4: Wait for TLS provisioning

Confirm HTTPS padlock on both admin URLs before testing redirects.

### Step 5: Test redirect matrix on real hostnames

```bash
# Case 1 — public host blocks dashboard
curl -I https://dev.wazifa.app/dashboard

# Case 2 — admin root opens dashboard
curl -I https://dev-admin.wazifa.app/

# Case 3 — admin blocks public pages
curl -I https://dev-admin.wazifa.app/jobs
```

## Verify
- `ADMIN_HOSTS` / `PUBLIC_HOSTS` match DNS hostnames.
- Both staging admin and public URLs resolve over HTTPS.
- No duplicate or conflicting DNS records in Cloudflare.
- `ADMIN_HOSTS` in `proxy.ts` matches DNS hostnames exactly (case-insensitive after `.toLowerCase()`).

## Outcome

Wire DNS so `admin.wazifa.app` and `dev-admin.wazifa.app` point to the same DigitalOcean app as the public site, enabling host-based routing.

## Notes / Gaps

- DNS propagation can take minutes; allow propagation time before testing.
- Day 10 auth requires consistent cookie domain behavior across subdomains — future lesson.
- `admin.wazifa.app/jobs` should redirect to `/dashboard` (Case 3) even before admin pages exist.

## Next

[Lecture 34 - Route Groups](./lecture-034-route-groups.md)
