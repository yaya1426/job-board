# Day 2 - Domain, DNS and HTTPS

## Goal

Teach the infrastructure side of launching a real app: domains, DNS records, Cloudflare nameservers, DigitalOcean hosting connection, and HTTPS verification.

## Lectures Covered

- Lecture 11 - Day 2 Plan
- Lecture 12 - What is a Domain
- Lecture 13 - Buy Domain: Best Options
- Lecture 14 - DNS Records
- Lecture 15 - Connect Cloudflare Nameservers
- Lecture 16 - Connect Domain to DigitalOcean Hosting
- Lecture 17 - HTTPS / SSL Verify Setup
- Lecture 18 - Recap Day 2

## Commit Evidence

No direct repository commits were found for Day 2.

That matches the topic: the work appears to have happened mostly outside the codebase in DNS, Cloudflare, and DigitalOcean settings.

## Final State

The project context now assumes:

- Production domain setup exists.
- Cloudflare manages DNS.
- DigitalOcean App Platform hosts the app.
- HTTPS/SSL is verified.

Later project context identifies the production surfaces as:

- `wazifa.app` for the public client app.
- `admin.wazifa.app` for the admin surface.

Development/staging subdomains were introduced later on Day 7.

## Teaching Narrative

This day is mostly conceptual and operational. Students learn that a production app is more than code: DNS, hosting, and TLS are part of the product.

The value is in demystifying the path from a local app to a real URL with HTTPS.

## Notes

- Because there are no Day 2 commits, this doc is based on the lecture list and current project context.
- Any exact DNS values should be verified in Cloudflare/DigitalOcean rather than inferred from the repo.
