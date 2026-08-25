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

## Recording Outline

- Define DNS as the internet’s phone book: hostname → target address or alias.
- Explain common record types: `A`, `AAAA`, `CNAME`, `TXT` (for verification).
- Show apex vs subdomain record patterns for App Platform.
- Explain propagation delay—changes are not instant worldwide.
- Introduce Cloudflare proxy (orange cloud) vs DNS-only (grey cloud)—TLS implications.
- Walk adding records for `wazifa.app` and `admin.wazifa.app` toward DO.
- Warn against conflicting duplicate records for the same name.
- Preview nameserver change to Cloudflare in the next lecture.

## Verify in Repo

- No DNS in git—verify records in Cloudflare DNS dashboard.
- Confirm `proxy.ts` hostnames match the DNS names you configure.

## Notes / Gaps

- Exact App Platform CNAME targets vary per app/region—copy from DigitalOcean dashboard, do not guess.
- `dev.wazifa.app` / `dev-admin.wazifa.app` records added Day 7 for staging.
- TTL and proxy settings affect how quickly changes appear during the course.

## Next

[Lecture 15 — Connect Cloudflare Nameservers](./lecture-015-connect-cloudflare-nameservers.md)
