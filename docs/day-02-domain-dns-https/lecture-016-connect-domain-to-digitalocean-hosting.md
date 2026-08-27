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

## Implementation steps

### Step 1 — Add custom domains in DigitalOcean *(external ops)*
- In DigitalOcean App Platform → your app → **Settings** → **Domains**:
  - Add `wazifa.app` as a custom domain.
  - Add `admin.wazifa.app` as a custom domain.
- DigitalOcean may require separate domain entries per hostname.

### Step 2 — Copy DNS targets into Cloudflare *(external ops)*
- DigitalOcean provides DNS targets (CNAME or A records) for each custom domain.
- In Cloudflare DNS dashboard:
  - Ensure apex `wazifa.app` record points to the DO-provided target.
  - Ensure `admin.wazifa.app` CNAME points to the DO-provided target.
- **Copy exact values from the DigitalOcean dashboard**—targets vary per app/region.

### Step 3 — Review one app, two hostnames
- Both `wazifa.app` and `admin.wazifa.app` route to the **same** Next.js deployment (modular monolith).
- Surface split (public vs admin) is application routing via `proxy.ts` (Day 4)—not separate deploys.
- Until Day 4, both URLs may show identical content (the Day 1 starter page).

### Step 4 — Wait for domain verification *(external ops)*
- In DigitalOcean, wait until each domain shows as verified/configured.
- Test HTTP access before expecting HTTPS (Lecture 17).
- The default App Platform URL still works as a fallback during migration.

### Step 5 — Cross-check with codebase
- Confirm `Dockerfile` is still the deploy artifact App Platform builds:

```80:83:Dockerfile
# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

- Inspect `proxy.ts` and confirm hostnames match DigitalOcean domain configuration:

```5:6:proxy.ts
const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
const PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"];
```

## Verify
- [ ] `wazifa.app` and `admin.wazifa.app` are added in DigitalOcean App Platform → Domains.
- [ ] Cloudflare DNS records match DO-provided targets.
- [ ] DigitalOcean shows both domains as verified/configured.
- [ ] `http://wazifa.app` responds (HTTPS comes in Lecture 17).
- [ ] `proxy.ts` hostnames match configured custom domains.

## Outcome

- Custom domains `wazifa.app` and `admin.wazifa.app` attached to the Day 1 App Platform deployment.
- DNS in Cloudflare points both hostnames to the same Next.js container.
- Ready for HTTPS verification in Lecture 17.

## Notes / Gaps

- Day 2 may complete domain connection before `proxy.ts` exists—both URLs may show the same starter page until Day 4 routing.
- Staging domains (`dev.wazifa.app`, `dev-admin.wazifa.app`) connected Day 7.
- App Platform may require separate domain entries per hostname.

## Next

[Lecture 17 — HTTPS / SSL Verify Setup](./lecture-017-https-ssl-verify-setup.md)
