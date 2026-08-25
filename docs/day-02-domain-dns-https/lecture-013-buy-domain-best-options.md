# Lecture 13 - Buy Domain: Best Options | شراء النطاق: أفضل الخيارات

## Goal

Guide students through purchasing `wazifa.app` (or equivalent) from a registrar and preparing it for Cloudflare DNS management.

## Implementation Status

External/ops only

## Key Files (as implemented today)

- `proxy.ts` (references purchased hostnames `wazifa.app` and `admin.wazifa.app`)
- `docs/day-02-domain-dns-https/README.md`

## What Was Built

- Domain registered through a registrar (e.g. Namecheap, Porkbun, Google Domains successor, or registrar bundled with Cloudflare).
- Ownership of `wazifa.app` enabling DNS control for production and later staging subdomains.
- No application code changes—pure infrastructure procurement.

## Recording Outline

- Compare registrar options: price, renewal cost, WHOIS privacy, transfer policy.
- Search and purchase `wazifa.app` (or course-equivalent domain).
- Explain `.app` TLD and Google’s HTTPS requirement for `.app` zones.
- Register the apex domain; subdomains are configured later in DNS—not purchased separately.
- Recommend keeping registrar login and 2FA secure—domain hijacking is real.
- Plan to point nameservers to Cloudflare in Lecture 15 (can transfer DNS or use Cloudflare registrar).
- Do not connect to DigitalOcean yet—DNS foundation first.
- Note students may use a different domain; `proxy.ts` constants must match their hostnames later.

## Verify in Repo

- No code to verify—confirm domain ownership in registrar dashboard.
- Cross-check intended hostnames against `proxy.ts` `PUBLIC_HOSTS` / `ADMIN_HOSTS`.

## Notes / Gaps

- Registrar UI changes frequently; verify exact purchase steps in the live dashboard.
- Course uses `wazifa.app`; students with other domains update `proxy.ts` when taught on Day 4.
- Staging subdomains (`dev.*`) are configured Day 7, not during initial purchase.

## Next

[Lecture 14 — DNS Records](./lecture-014-dns-records.md)
