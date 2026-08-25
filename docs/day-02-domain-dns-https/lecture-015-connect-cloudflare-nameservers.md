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

## Recording Outline

- Explain nameservers: registrar delegates DNS control to Cloudflare.
- Add site to Cloudflare; import or recreate DNS records from Lecture 14.
- Copy Cloudflare nameservers from the dashboard.
- Update nameservers at the registrar; save and wait for propagation.
- Verify active status in Cloudflare (zone status “Active”).
- Explain Cloudflare benefits for this course: DNS UI, proxy/CDN, TLS, DDoS basics.
- Caution: nameserver change can take up to 24–48 hours though often faster.
- Once active, all DNS edits happen in Cloudflare—not the registrar.

## Verify in Repo

- No code changes—confirm Cloudflare zone shows “Active” for `wazifa.app`.
- Use `dig NS wazifa.app` or Cloudflare dashboard to confirm nameserver delegation.

## Notes / Gaps

- If domain was purchased through Cloudflare Registrar, nameserver step may be automatic.
- Staging subdomains and additional records added Day 7 in the same Cloudflare zone.
- Proxy (orange cloud) settings affect SSL mode and origin connection—revisited in Lecture 17.

## Next

[Lecture 16 — Connect Domain to DigitalOcean Hosting](./lecture-016-connect-domain-to-digitalocean-hosting.md)
