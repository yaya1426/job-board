# Day 2 - Domain, DNS and HTTPS

## Goal

Teach the infrastructure side of launching a real app: domains, DNS records, Cloudflare nameservers, DigitalOcean hosting connection, and HTTPS verification.

## Complete Lecture Sequence

- [Lecture 11 - Day 2 Plan | خطة اليوم الثاني](./lecture-011-day-2-plan.md)
- [Lecture 12 - What is a Domain | ما هو النطاق (الدومين)](./lecture-012-what-is-a-domain.md)
- [Lecture 13 - Buy Domain: Best Options | شراء النطاق: أفضل الخيارات](./lecture-013-buy-domain-best-options.md)
- [Lecture 14 - DNS Records | سجلات DNS](./lecture-014-dns-records.md)
- [Lecture 15 - Connect Cloudflare Nameservers | ربط خوادم أسماء Cloudflare](./lecture-015-connect-cloudflare-nameservers.md)
- [Lecture 16 - Connect Domain to DigitalOcean Hosting | ربط النطاق مع استضافة DigitalOcean](./lecture-016-connect-domain-to-digitalocean-hosting.md)
- [Lecture 17 - HTTPS / SSL Verify Setup | إعداد HTTPS والتحقق من SSL](./lecture-017-https-ssl-verify-setup.md)
- [Lecture 18 - Recap Day 2 | ملخص اليوم الثاني](./lecture-018-recap-day-2.md)

## Teaching Order

```txt
011: plan the infrastructure day (no code)
012-013: domain concepts and purchase
014-015: DNS records and Cloudflare nameserver delegation
016: attach wazifa.app + admin.wazifa.app to App Platform
017: verify HTTPS / TLS
018: recap the full infra chain
```

## Commit Evidence

No direct repository commits were found for Day 2.

That matches the topic: the work happened mostly outside the codebase in DNS, Cloudflare, and DigitalOcean settings.

## Final State

The project context now assumes:

- Production domain setup exists.
- Cloudflare manages DNS.
- DigitalOcean App Platform hosts the app.
- HTTPS/SSL is verified.

Later project context identifies the production surfaces as:

- `wazifa.app` for the public client app.
- `admin.wazifa.app` for the admin surface.

Development/staging subdomains were introduced later on Day 7:

- `dev.wazifa.app`
- `dev-admin.wazifa.app`

Hostname routing is enforced in code via `proxy.ts` (Day 4), referencing:

```ts
const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
const PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"];
```

## Key Files (code references)

- `proxy.ts` — host-based routing constants (Day 4)
- `Dockerfile` — same deploy target from Day 1

## Teaching Narrative

This day is mostly conceptual and operational. Students learn that a production app is more than code: DNS, hosting, and TLS are part of the product.

The value is in demystifying the path from a local app to a real URL with HTTPS.

## Notes

- Because there are no Day 2 commits, lecture files are grounded in the lecture list, `proxy.ts` constants, and current project context.
- Any exact DNS values should be verified in Cloudflare/DigitalOcean rather than inferred from the repo.
- Until Day 4, both hostnames may show identical starter content—`proxy.ts` routing arrives later.
- Staging subdomains and branch workflow arrive Day 7.

## Day 3 handoff

Day 2 ends with HTTPS URLs live. Day 3 teaches App Router fundamentals inside the codebase.
