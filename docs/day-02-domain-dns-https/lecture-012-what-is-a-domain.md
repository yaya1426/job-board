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

## Implementation steps

### Step 1 — Define domain, URL, and IP *(external ops — conceptual)*
- Define:
  - **IP address** — numeric location of a server on the internet.
  - **Domain name** — human-readable label (e.g. `wazifa.app`) that DNS resolves to an IP or alias.
  - **URL** — full address including protocol and path (e.g. `https://wazifa.app/jobs`).
- Browser flow: user types `wazifa.app` → DNS lookup → hosting provider.

### Step 2 — Registrable domain vs subdomain
- Registrable domain: `wazifa.app` (purchased once).
- Subdomain: `admin.wazifa.app` (configured in DNS, not purchased separately).
- Map to product surfaces:
  - `wazifa.app` → public candidate experience.
  - `admin.wazifa.app` → internal admin dashboard.

### Step 3 — Branded domain vs App Platform default URL
- Contrast: the Day 1 App Platform URL (e.g. `https://<app>.ondigitalocean.app`) with `wazifa.app`.
- Reasons for a branded domain: trust, memorability, consistent product identity.
- .app TLD implies HTTPS expectations (Google enforces HTTPS for `.app` zones).

### Step 4 — Preview hostname routing in code
- Inspect `proxy.ts` and confirm the host constants the app will eventually enforce (Day 4):

```5:6:proxy.ts
const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
const PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"];
```

- later, `request.headers.get("host")` drives which product surface a request enters.
- DNS record types are covered in Lecture 14.

## Verify
- [ ] You can define domain vs URL vs IP.
- [ ] You can explain `wazifa.app` vs `admin.wazifa.app`.
- [ ] `proxy.ts` lines 5–6 show intended production hostnames.
- [ ] No Day 2 commits exist in `git log` for domain-related code.
- [ ] `dev.wazifa.app` / `dev-admin.wazifa.app` are noted as Day 7 additions.

## Outcome

- Conceptual foundation for Day 2 operational work: `wazifa.app` as public identity, `admin.wazifa.app` as admin surface.
- No repository changes on this lecture.

## Notes / Gaps

- `dev.wazifa.app` and `dev-admin.wazifa.app` were added to `proxy.ts` on Day 7 for staging—not Day 2.
- Day 2 establishes production hostnames only in operations; code enforcement arrives Day 4.

## Next

[Lecture 13 — Buy Domain: Best Options](./lecture-013-buy-domain-best-options.md)
