# Lecture 15 - Connect Cloudflare Nameservers | ربط خوادم أسماء Cloudflare

## Goal

Move DNS authority to Cloudflare by updating registrar nameservers so all records are managed in one panel with CDN and TLS features.

## Implementation Status

External/ops only

## Key Files (as implemented today)

- `docs/day-02-domain-dns-https/README.md`
- `proxy.ts` (hostnames that DNS must resolve to the app)

## What Was Built

- Cloudflare zone created for `wazifa.app`.
- Registrar nameservers updated to Cloudflare-assigned NS records (e.g. `*.ns.cloudflare.com`).
- DNS management centralized in Cloudflare for production and future staging subdomains.

## Implementation steps

### Step 1 — Review nameserver delegation *(external ops)*
- The registrar delegates DNS authority to Cloudflare via nameserver (NS) records.
- Once delegated, all DNS edits happen in Cloudflare—not the registrar.

### Step 2 — Add site to Cloudflare *(external ops)*
- In Cloudflare dashboard:
  - Add site `wazifa.app`.
  - Import or manually recreate DNS records from Lecture 14.
  - Select the appropriate plan (Free tier is sufficient for this project).

### Step 3 — Update registrar nameservers *(external ops)*
- Copy Cloudflare-assigned nameservers (e.g. `*.ns.cloudflare.com`) from the Cloudflare dashboard.
- In the registrar dashboard:
  - Replace existing nameservers with Cloudflare NS records.
  - Save and wait for propagation (often minutes, up to 24–48 hours).

### Step 4 — Verify zone activation *(external ops)*
- In Cloudflare dashboard, confirm zone status shows **Active** for `wazifa.app`.
- Optional terminal check:

```bash
dig NS wazifa.app
```

- Confirm returned nameservers are Cloudflare-assigned.

### Step 5 — Review Cloudflare benefits and next steps
- Benefits for this course: centralized DNS UI, proxy/CDN, TLS management, basic DDoS protection.
- Caution: proxy (orange cloud) settings affect SSL mode—revisited in Lecture 17.
- If domain was purchased through Cloudflare Registrar, this step may be automatic.
- Next: connect custom domains in DigitalOcean App Platform (Lecture 16).

## Verify
- [ ] Cloudflare zone for `wazifa.app` shows status **Active**.
- [ ] `dig NS wazifa.app` returns Cloudflare nameservers.
- [ ] DNS records from Lecture 14 are present in the Cloudflare zone.
- [ ] Registrar nameservers point to Cloudflare (not the old registrar DNS).
- [ ] No code changes in the repository.

## Outcome

- DNS management centralized in Cloudflare for `wazifa.app`.
- Registrar nameservers updated; zone active and ready for DigitalOcean domain connection.

## Notes / Gaps

- If domain was purchased through Cloudflare Registrar, nameserver step may be automatic.
- Staging subdomains and additional records added Day 7 in the same Cloudflare zone.
- Proxy (orange cloud) settings affect SSL mode and origin connection—revisited in Lecture 17.

## Next

[Lecture 16 — Connect Domain to DigitalOcean Hosting](./lecture-016-connect-domain-to-digitalocean-hosting.md)
