# Lecture 32 - Ship proxy.ts | نشر ملف البروكسي

## Goal

Implement and deploy the first `proxy.ts` rules so public and admin hosts behave differently in staging/production.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `proxy.ts`
- DigitalOcean App Platform app settings (runtime env, domains)
- Cloudflare DNS records for admin subdomains

## What Was Built

Students added `proxy.ts`, iterated through redirect-loop fixes, host equality checks (`e6a880a`), and favicon exclusion. Commits `b7f83c2`, `375a025`, `9beaf96`, `db360db`, `e6a880a`, and `a225fd3` document the debugging trail. Deployed build must include the proxy file at repo root.

## Recording Outline

- Create `proxy.ts` with host constants and first redirect rules.
- Test locally with `Host` header overrides or deployed subdomain (localhost lacks real subdomains).
- Hit the infinite redirect bug: catch-all rule redirecting everything including targets — fix with precise pathname checks.
- Normalize host: `.toLowerCase()` and exact array membership (`e6a880a`).
- Add logging temporarily (`9beaf96`) to see host + pathname in deploy logs.
- Exclude `favicon.ico` from matcher to stop spurious proxy hits.
- Deploy to `dev.wazifa.app` / `dev-admin.wazifa.app`.
- Verify Case 1–3 on staging URLs.
- Remove debug logs before milestone commit.
- Transition to DNS/subdomain configuration.

## Verify in Repo

- `git log --oneline -- proxy.ts` shows Day 4 fix commits.
- `proxy.ts` has no accidental catch-all redirect loop.
- Staging: `wazifa.app/dashboard` redirects to `/` on public host.
- Staging: `admin.wazifa.app/` redirects to `/dashboard`.

## Notes / Gaps

- Local `localhost` won't trigger admin host rules without extra tooling.
- Auth redirects in current proxy are Day 10 — Day 4 checkpoint stops at host routing.
- `getServerSession()` does not work in proxy; Day 10 uses `getToken()` instead.

## Next

[Lecture 33 - Configure Admin Sub-domain](./lecture-033-configure-admin-sub-domain.md)
