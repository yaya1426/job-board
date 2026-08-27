# Lecture 36 - Ship It: Deploy Checkpoint | نقطة نشر اليوم

## Goal

Deploy Day 4 work — proxy rules, DNS, route groups, and admin routes — and verify both hostnames on staging.

## Implementation Status

External (deploy process); Implemented (code ready)

## Key Files (as implemented today)

- `proxy.ts`
- `app/(client)/` and `app/(admin)/dashboard/` route trees
- DigitalOcean + Cloudflare configuration

## What Was Built

Day 4 feature work was merged, deployed to App Platform, and ran a hostname checklist: public site shows product routes only; admin subdomain lands on dashboard; cross-host redirects behave per proxy Cases 1–3.

## Implementation steps

### Step 1: Pre-deploy checklist

- [ ] `proxy.ts` committed with Cases 1–3 (no auth yet).
- [ ] Route groups `(client)` and `(admin)` in place.
- [ ] Admin placeholder pages exist under `app/(admin)/dashboard/`.
- [ ] DNS records for `dev-admin.wazifa.app` configured.

### Step 2: Push and deploy

```bash
git status
git push origin <branch>
# merge to development per course workflow
```

Watch DigitalOcean build — confirm no `proxy.ts` TypeScript errors.

### Step 3: Test public host

On `dev.wazifa.app`:

- `/` — home loads.
- `/jobs` — jobs listing loads.
- `/dashboard` — redirects to `/` (Case 1).

### Step 4: Test admin host

On `dev-admin.wazifa.app`:

- `/` — redirects to `/dashboard` (Case 2).
- `/jobs` — redirects to `/dashboard` (Case 3).
- `/dashboard` — overview placeholder loads.
- `/dashboard/jobs` — jobs admin placeholder loads.

### Step 5: Document local dev limitation

`localhost:3000` does not trigger host rules without `/etc/hosts` overrides. Staging URLs are the real test.

## Verify
- Latest branch includes `proxy.ts` and `(admin)` routes.
- Staging hostname redirect matrix passes.
- Matcher still excludes favicon and static assets.
- Staging URLs pass hostname redirect matrix.
- No open redirect vulnerabilities from unchecked query params (out of scope but good awareness).

## Outcome

Deploy Day 4 work — proxy rules, DNS, route groups, and admin routes — and verify both hostnames on staging.

## Notes / Gaps

- Post-Day 10 deploy tests will also require admin login — not part of Day 4 checkpoint.
- Local dev testing of host rules remains limited without `/etc/hosts` tricks.
- Favicon/static exclusions must stay in matcher after deploy.

## Next

[Lecture 37 - Recap Day (4)](./lecture-037-recap-day-4.md)
