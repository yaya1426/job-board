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

## Implementation steps
### Step 1

In Cloudflare DNS, add `dev-admin` CNAME record pointing to the same DigitalOcean dev app (or paired admin component) as `dev.wazifa.app`.

### Step 2

Inspect `proxy.ts` and update host constants:

```ts
const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
const PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"];
```

No other proxy logic changes — same redirect rules as production admin.

### Step 3

Create a feature branch, commit, and open PR to `development`:

```bash
git checkout development
git pull
git checkout -b feature/day-7-proxy-config
# edit proxy.ts
git add proxy.ts
git commit -m "Day 7: proxy config for new dev domains"
git push -u origin feature/day-7-proxy-config
```

### Step 4

Merge PR to `development`; wait for DigitalOcean dev deploy.

### Step 5

Test staging admin routing:
- `dev-admin.wazifa.app/` → redirects to `/dashboard`
- `dev-admin.wazifa.app/jobs` → redirects to `/dashboard`
- `dev.wazifa.app/dashboard` → redirects to `/`

Local test with Host header:

```bash
curl -I -H "Host: dev-admin.wazifa.app" http://localhost:3000/
```

### Verify

```bash
git log --oneline --grep="Day 7"
# -> 4a67ba3 Day 7: proxy config for new dev domains
```

- `proxy.ts` lines 5–6 contain all four domains.
- Comment on line 50 references `dev-admin.wazifa.app/dashboard`.
- **Current repo note:** Day 10+ added JWT role checks in proxy; At Day 7 only had host-based redirects.

### End State

Four-host model is live on staging. `proxy.ts` is the **only in-repo code change** for Day 7. Staging admin behaves like production admin for host-based routing.

## Verify
```bash
git log --oneline --grep="Day 7"
# -> 4a67ba3 Day 7: proxy config for new dev domains
# -> b95d362 Merge pull request #1 from yaya1426/feature/day-7-proxy-config
```

- Lines 5–6 of `proxy.ts` contain all four domains.
- Comment on line 50 references `dev-admin.wazifa.app/dashboard`.

## Notes/Gaps
- Day 10+ added JWT role checks in proxy; At Day 7 only had host-based redirects.
- Local testing: `curl -H "Host: dev-admin.wazifa.app" http://localhost:3000/`.

## Next
Lecture 063 — branch rules for develop and main.
