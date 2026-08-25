# Lecture 16 - Connect Domain to DigitalOcean Hosting | ربط النطاق مع استضافة DigitalOcean

## Goal

Attach `wazifa.app` and `admin.wazifa.app` to the DigitalOcean App Platform app so traffic reaches the Day 1 deployment.

## Implementation Status

External/ops only

## Key Files (as implemented today)

- `Dockerfile` (deploy artifact consumed by App Platform)
- `proxy.ts` (app logic keyed to these hostnames from Day 4)
- `next.config.ts`

## What Was Built

- Custom domains added in DigitalOcean App Platform settings.
- DNS records in Cloudflare pointing apex and `admin` subdomain to App Platform.
- Both hostnames route to the same Next.js deployment (modular monolith—one app, two surfaces later).

## Recording Outline

- Open DigitalOcean App Platform → app → Settings → Domains.
- Add `wazifa.app` and `admin.wazifa.app` as custom domains.
- Copy DO-provided DNS targets (CNAME or A records) into Cloudflare.
- Explain both domains hit the same container—surface split is application routing, not separate deploys.
- Wait for DO to detect DNS and show domain as verified/configured.
- Test HTTP access before expecting HTTPS (Lecture 17).
- Show default App Platform URL still works as fallback during migration.
- Preview `proxy.ts` (Day 4) reading `host` header to route public vs admin.

## Verify in Repo

- Load `http://wazifa.app` (or HTTPS after Lecture 17) and confirm Next.js app responds.
- Open `proxy.ts` and confirm hostnames match DigitalOcean domain configuration.

## Notes / Gaps

- Day 2 may complete domain connection before `proxy.ts` exists—both URLs may show the same starter page until Day 4 routing.
- Staging domains (`dev.wazifa.app`, `dev-admin.wazifa.app`) connected Day 7.
- App Platform may require separate domain entries per hostname.

## Next

[Lecture 17 — HTTPS / SSL Verify Setup](./lecture-017-https-ssl-verify-setup.md)
