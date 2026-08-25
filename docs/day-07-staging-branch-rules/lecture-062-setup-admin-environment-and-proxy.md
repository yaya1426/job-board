# Lecture 62 - Setup Admin Environment + Proxy

## Goal

Add `dev-admin.wazifa.app` to DNS and update `proxy.ts` so staging admin routing matches production admin behavior.

## Implementation Status

**Complete.** `proxy.ts` includes both dev hostnames. This is the primary code change for Day 7.

## Key Files

- `proxy.ts`
- Cloudflare DNS: `dev-admin` CNAME
- DigitalOcean: same or paired dev app serving admin host

## What Was Built

```ts
const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
const PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"];
```

Proxy rules unchanged in logic — only host lists expanded:

- Public host + `/dashboard` → redirect `/`
- Admin host `/` → redirect `/dashboard`
- Admin host non-dashboard paths → `/dashboard` (except `/login`, `/not-authorized`)

## Recording Outline

1. Explain admin subdomain from Day 4; now duplicate for staging.
2. Add `dev-admin` DNS in Cloudflare.
3. Open `proxy.ts` and add dev hostnames to arrays.
4. Deploy via feature branch → PR → merge to development.
5. Test `dev-admin.wazifa.app/dashboard` locally with Host header or on staging URL.

## Verify in Repo

```bash
git log --oneline --grep="Day 7"
# -> 4a67ba3 Day 7: proxy config for new dev domains
# -> b95d362 Merge pull request #1 from yaya1426/feature/day-7-proxy-config
```

- Lines 5–6 of `proxy.ts` contain all four domains.
- Comment on line 50 references `dev-admin.wazifa.app/dashboard`.

## Notes/Gaps

- Day 10+ added JWT role checks in proxy; Day 7 students only had host-based redirects.
- Local testing: `curl -H "Host: dev-admin.wazifa.app" http://localhost:3000/`.

## Next

Lecture 063 — branch rules for develop and main.
