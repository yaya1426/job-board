# Lecture 12 - What is a Domain | ما هو النطاق (الدومين)

## Goal

Explain what a domain name is, how it maps to hosting, and why `wazifa.app` matters as the public identity of the product.

## Implementation Status

External/ops only (conceptual lecture; hostname constants codified in `proxy.ts` on Day 4).

## Key Files (as implemented today)

- `proxy.ts` — `PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"]` and `ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"]`

## What Was Built

- Conceptual foundation for Day 2 operational work—no repo changes on this lecture.
- Product naming decision: `wazifa.app` as the primary public hostname.
- Admin surface planned at `admin.wazifa.app` (subdomain of the same registrable domain).

## Recording Outline

- Define domain vs URL vs IP address with a simple browser example.
- Explain registrable domain (`wazifa.app`) vs subdomain (`admin.wazifa.app`).
- Show how users type a hostname; DNS resolves it to the hosting provider.
- Contrast App Platform default URL vs branded domain—trust and memorability.
- Introduce TLD choice (`.app` implies HTTPS expectations).
- Map hostnames to product surfaces: public candidate app vs admin dashboard.
- Preview that code will later read `request.headers.get("host")` in `proxy.ts`.
- Avoid deep DNS record types yet—that is Lecture 14.

## Verify in Repo

- Open `proxy.ts` lines 5–6 and read `ADMIN_HOSTS` and `PUBLIC_HOSTS`.
- Confirm no Day 2 commits in `git log` for domain-related code.

## Notes / Gaps

- `dev.wazifa.app` and `dev-admin.wazifa.app` were added to `proxy.ts` on Day 7 for staging—not Day 2.
- Day 2 establishes production hostnames only in operations; code enforcement arrives Day 4.

## Next

[Lecture 13 — Buy Domain: Best Options](./lecture-013-buy-domain-best-options.md)
