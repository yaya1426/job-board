# Lecture 13 - Buy Domain: Best Options | شراء النطاق: أفضل الخيارات

## Goal

Purchase `wazifa.app` (or equivalent) from a registrar and prepare it for Cloudflare DNS management.

## Implementation Status

External/ops only

## Key Files (as implemented today)

- `proxy.ts` (references purchased hostnames `wazifa.app` and `admin.wazifa.app`)
- `docs/day-02-domain-dns-https/README.md`

## What Was Built

- Domain registered through a registrar (e.g. Namecheap, Porkbun, Google Domains successor, or registrar bundled with Cloudflare).
- Ownership of `wazifa.app` enabling DNS control for production and later staging subdomains.
- No application code changes—pure infrastructure procurement.

## Implementation steps

### Step 1 — Compare registrar options *(external ops)*
- Compare registrars: Namecheap, Porkbun, Cloudflare Registrar, etc.
- Evaluation criteria: first-year price, renewal cost, WHOIS privacy, transfer policy, 2FA support.

### Step 2 — Search and purchase the domain *(external ops)*
- In the registrar dashboard:
  - Search for `wazifa.app` (or course-equivalent domain).
  - Complete purchase with WHOIS privacy enabled if available.
- `.app` TLD: Google requires HTTPS for `.app` zones—sets expectation for Lecture 17.

### Step 3 — Understand what you own
- Register the **apex** domain (`wazifa.app`) only.
- Subdomains (`admin.wazifa.app`) are configured later in DNS—not purchased separately.
- Secure registrar login with a strong password and 2FA—domain hijacking is real.

### Step 4 — Plan DNS delegation
- Do **not** connect to DigitalOcean yet—DNS foundation comes first (Lectures 14–15).
- Plan to point nameservers to Cloudflare in Lecture 15.
- If using Cloudflare Registrar, nameserver delegation may be automatic.

### Step 5 — Align hostnames with codebase
- Inspect `proxy.ts` and confirm intended production hostnames:

```5:6:proxy.ts
const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
const PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"];
```

- A different domain requires updating these constants on Day 4.
- Staging subdomains (`dev.*`) are configured Day 7, not during initial purchase.

## Verify
- [ ] Domain ownership confirmed in registrar dashboard.
- [ ] Apex domain `wazifa.app` (or equivalent) is registered.
- [ ] Registrar account secured with 2FA.
- [ ] Intended hostnames match `proxy.ts` `PUBLIC_HOSTS` / `ADMIN_HOSTS`.
- [ ] No application code changes in this lecture.

## Outcome

- Domain `wazifa.app` registered and owned, ready for Cloudflare DNS management.
- No application code changes—pure infrastructure procurement.

## Notes / Gaps

- Registrar UI changes frequently; verify exact purchase steps in the live dashboard.
- Course uses `wazifa.app`; other domains update `proxy.ts` on Day 4.
- Staging subdomains (`dev.*`) are configured Day 7, not during initial purchase.

## Next

[Lecture 14 — DNS Records](./lecture-014-dns-records.md)
