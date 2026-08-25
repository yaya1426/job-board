# Lecture 17 - HTTPS / SSL Verify Setup | إعداد HTTPS والتحقق من SSL

## Goal

Verify TLS/HTTPS is active on `wazifa.app` and `admin.wazifa.app` so users connect securely—required for `.app` TLD and production trust.

## Implementation Status

External/ops only

## Key Files (as implemented today)

- `docs/day-02-domain-dns-https/README.md`
- `proxy.ts` (production traffic expected over HTTPS)

## What Was Built

- TLS certificates issued (via DigitalOcean App Platform and/or Cloudflare SSL).
- HTTPS enforced for custom domains—browser shows padlock on both hostnames.
- HTTP→HTTPS redirect behavior confirmed (Cloudflare or origin).

## Recording Outline

- Explain TLS: encrypts traffic between browser and server; required for cookies, auth, and `.app` domains.
- Review Cloudflare SSL/TLS mode (Full or Full (strict)) vs origin certificate on DO.
- Check certificate status in DigitalOcean domain settings—wait if “Provisioning”.
- Open `https://wazifa.app` and `https://admin.wazifa.app` in browser; inspect padlock.
- Use browser devtools or `curl -I` to confirm HTTPS response and redirects.
- Discuss mixed content warnings—avoid `http://` asset URLs on HTTPS pages.
- Note NextAuth and secure cookies depend on HTTPS in production (`NEXTAUTH_URL`).
- Troubleshoot common issues: DNS not propagated, wrong SSL mode, expired cert pending.

## Verify in Repo

- Browse to `https://wazifa.app` and `https://admin.wazifa.app`—confirm valid HTTPS.
- After Day 10, confirm `NEXTAUTH_URL` uses `https://` in production env vars.

## Notes / Gaps

- Exact SSL provisioning path depends on Cloudflare proxy on/off and DO integration.
- `NEXTAUTH_URL` and cookie security configured Day 10—not Day 2.
- Staging HTTPS on `dev.*` subdomains verified when staging is set up Day 7.

## Next

[Lecture 18 — Recap Day 2](./lecture-018-recap-day-2.md)
