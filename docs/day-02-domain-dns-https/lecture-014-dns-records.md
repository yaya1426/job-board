# Lecture 14 - DNS Records | سجلات DNS

## Goal

Teach the DNS record types needed to point `wazifa.app` and `admin.wazifa.app` at DigitalOcean App Platform.

## Implementation Status

External/ops only

## Key Files (as implemented today)

- `proxy.ts` — documents which hostnames the app expects at runtime
- `docs/day-02-domain-dns-https/README.md`

## What Was Built

- DNS records configured in Cloudflare (or registrar DNS before Cloudflare migration):
  - Apex (`wazifa.app`) — typically `A`/`AAAA` or `CNAME` flattening to App Platform.
  - Admin subdomain (`admin.wazifa.app`) — `CNAME` to App Platform target.
- Foundation for HTTPS certificate issuance once records propagate.

## Implementation steps

### Step 1 — Define DNS *(external ops — conceptual)*
- DNS is the internet’s phone book—hostname → target address or alias.
- propagation delay: changes are not instant worldwide.

### Step 2 — Learn record types *(external ops)*
- Cover the record types needed for App Platform:
  - **A** / **AAAA** — hostname → IPv4 / IPv6 address.
  - **CNAME** — hostname → another hostname (common for subdomains).
  - **TXT** — verification strings (domain ownership checks).
- Apex vs subdomain patterns:
  - Apex (`wazifa.app`) — typically `A`/`AAAA` or CNAME flattening to App Platform.
  - Subdomain (`admin.wazifa.app`) — `CNAME` to App Platform target.

### Step 3 — Add records in Cloudflare *(external ops)*
- In Cloudflare DNS dashboard (or registrar DNS before Cloudflare migration):
  - Add record for apex `wazifa.app` pointing to DigitalOcean App Platform target.
  - Add `CNAME` for `admin.wazifa.app` pointing to the same App Platform target.
- **Copy exact targets from the DigitalOcean dashboard**—do not guess CNAME values.
- Avoid duplicate/conflicting records for the same name.

### Step 4 — Understand Cloudflare proxy modes *(external ops)*
- **Orange cloud (proxied)** — traffic routes through Cloudflare CDN; affects TLS mode.
- **Grey cloud (DNS only)** — Cloudflare resolves DNS but does not proxy traffic.
- TLS implications are revisited in Lecture 17.

### Step 5 — Cross-check hostnames with codebase
- Inspect `proxy.ts` and confirm DNS names match runtime expectations:

```5:6:proxy.ts
const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
const PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"];
```

- Later: nameserver delegation to Cloudflare in Lecture 15.

## Verify
- [ ] DNS records for `wazifa.app` and `admin.wazifa.app` exist in Cloudflare (or registrar DNS).
- [ ] Record targets match values copied from DigitalOcean App Platform.
- [ ] No duplicate/conflicting records for the same hostname.
- [ ] `proxy.ts` hostnames match configured DNS names.
- [ ] `dev.wazifa.app` / `dev-admin.wazifa.app` are **not** configured yet (Day 7).

## Outcome

- DNS records configured pointing `wazifa.app` and `admin.wazifa.app` toward DigitalOcean App Platform.
- Foundation ready for nameserver delegation to Cloudflare (Lecture 15) and HTTPS (Lecture 17).

## Notes / Gaps

- Exact App Platform CNAME targets vary per app/region—copy from DigitalOcean dashboard, do not guess.
- `dev.wazifa.app` / `dev-admin.wazifa.app` records added Day 7 for staging.
- TTL and proxy settings affect how quickly changes appear during the course.

## Next

[Lecture 15 — Connect Cloudflare Nameservers](./lecture-015-connect-cloudflare-nameservers.md)
