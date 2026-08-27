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

## Implementation steps

### Step 1 — Review TLS and why it matters *(external ops — conceptual)*
- TLS encrypts traffic between browser and server.
- Required for: `.app` TLD (Google enforces HTTPS), secure cookies, NextAuth in production.
- Without HTTPS, browsers show warnings and auth cookies may not work securely.

### Step 2 — Configure Cloudflare SSL/TLS mode *(external ops)*
- In Cloudflare dashboard → SSL/TLS:
  - Review mode: **Full** or **Full (strict)** (recommended when origin has a valid certificate).
  - Avoid **Flexible** if origin expects HTTPS—can cause redirect loops.
- If orange cloud (proxy) is enabled, Cloudflare terminates TLS at the edge.

### Step 3 — Check DigitalOcean certificate status *(external ops)*
- In DigitalOcean App Platform → Domains:
  - Confirm certificate status for `wazifa.app` and `admin.wazifa.app`.
  - Wait if status shows “Provisioning”—can take several minutes after DNS propagates.

### Step 4 — Verify HTTPS in the browser *(external ops)*
- Inspect `https://wazifa.app` and `https://admin.wazifa.app`.
- Confirm browser padlock icon (valid certificate, no mixed-content warnings).
- Optional terminal check:

```bash
curl -I https://wazifa.app
curl -I https://admin.wazifa.app
```

- Look for `HTTP/2 200` or `HTTP/1.1 200` and confirm HTTP→HTTPS redirect if testing `http://`.

### Step 5 — Note production auth dependency
- After Day 10, production `NEXTAUTH_URL` must use `https://` (e.g. `https://wazifa.app`).
- Avoid mixed content: do not use `http://` asset URLs on HTTPS pages.
- Troubleshoot common issues: DNS not propagated, wrong SSL mode, certificate still provisioning.

## Verify
- [ ] `https://wazifa.app` loads with a valid padlock (no certificate warnings).
- [ ] `https://admin.wazifa.app` loads with a valid padlock.
- [ ] `curl -I https://wazifa.app` returns a successful HTTPS response.
- [ ] Cloudflare SSL/TLS mode is set appropriately (Full or Full strict).
- [ ] DigitalOcean domain settings show certificates issued/provisioned.
- [ ] No mixed-content warnings in browser devtools.

## Outcome

- TLS/HTTPS active on both `wazifa.app` and `admin.wazifa.app`.
- HTTP→HTTPS redirect behavior confirmed.
- Production infrastructure layer complete for initial launch—ready for Day 3 App Router work.

## Notes / Gaps

- Exact SSL provisioning path depends on Cloudflare proxy on/off and DO integration.
- `NEXTAUTH_URL` and cookie security configured Day 10—not Day 2.
- Staging HTTPS on `dev.*` subdomains verified when staging is set up Day 7.

## Next

[Lecture 18 — Recap Day (2)](./lecture-018-recap-day-2.md)
