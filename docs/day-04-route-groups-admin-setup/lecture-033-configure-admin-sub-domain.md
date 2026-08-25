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

Students added CNAME (or ALIAS) records for admin subdomains in Cloudflare, attached both hostnames to the App Platform service, and confirmed HTTPS certificates provision. The app code already lists these hosts in `proxy.ts`; DNS makes them real.

## Recording Outline

- Draw request flow: browser → Cloudflare → DigitalOcean → Next.js `proxy.ts` → route.
- Add `dev-admin.wazifa.app` CNAME to App Platform default hostname (staging first).
- Add `admin.wazifa.app` for production when ready.
- Attach domains in DigitalOcean App Platform UI.
- Wait for TLS certificate issuance; confirm HTTPS padlock.
- Test `dev-admin.wazifa.app/` → should redirect to `/dashboard` per proxy rules.
- Test `dev.wazifa.app/dashboard` → should redirect to `/` on public host.
- Explain why subdomains beat path-only admin (`/admin`) for surface separation.
- Note cookies and `NEXTAUTH_URL` implications for later auth days.
- Transition to route groups in the filesystem.

## Verify in Repo

- `ADMIN_HOSTS` in `proxy.ts` matches DNS hostnames exactly (case-insensitive after `.toLowerCase()`).
- Both staging admin and public URLs resolve over HTTPS.
- No duplicate or conflicting DNS records in Cloudflare.

## Notes / Gaps

- DNS propagation can take minutes; plan recording accordingly.
- Day 10 auth requires consistent cookie domain behavior across subdomains — future lesson.
- `admin.wazifa.app/jobs` should redirect to `/dashboard` (Case 3) even before admin pages exist.

## Next

[Lecture 34 - Route Groups](./lecture-034-route-groups.md)
