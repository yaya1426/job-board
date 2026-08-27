# Lecture 59 - Day (7) Plan

## Goal
Introduce Day 7 as an operations and workflow day: staging environments, branch strategy, release tagging — with one in-repo change (proxy dev hostnames).

## Implementation Status
**Complete.** Staging domains and proxy config are live. Branch rules and DigitalOcean setup are external to the repo.

## Key Files
- `docs/day-07-staging-branch-rules/README.md`
- `proxy.ts`
- DigitalOcean App Platform settings (external)
- GitHub branch protection (external)

## What Was Built
Day 7 plan covers:

- Why staging exists before production deploys.
- `development` branch + `dev.wazifa.app` app.
- `dev-admin.wazifa.app` admin staging host in proxy.
- Feature → develop → main flow and release tags.

## Implementation steps
### Step 1

Read `docs/day-07-staging-branch-rules/README.md` and list lectures 059–065.

### Step 2

Map the four-host environment map on paper or a slide:
- Production client: `wazifa.app`
- Production admin: `admin.wazifa.app`
- Staging client: `dev.wazifa.app`
- Staging admin: `dev-admin.wazifa.app`

### Step 3

Note the branch workflow: `feature/*` → `development` (staging deploy) → `main`/`production` (prod deploy + tag).

### Step 4

Inspect `proxy.ts` and confirm only host constants change on Day 7 — routing logic stays the same as Day 4.

### Step 5

Identify external work (DigitalOcean apps, Cloudflare DNS, GitHub branch protection) vs in-repo work (`proxy.ts` dev hostnames).

### Verify

- Day 7 README documents lectures and commit `4a67ba3`.
- `proxy.ts` lines 5–6 list all four domains in `ADMIN_HOSTS` and `PUBLIC_HOSTS`.

### End State

You understand Day 7 as an ops/workflow day with one code change: adding dev hostnames to `proxy.ts`. Almost everything else happens in GitHub, DigitalOcean, and Cloudflare dashboards.

## Verify
- Day 7 README documents lectures and commit `4a67ba3`.
- `proxy.ts` lists four host constants.

## Notes/Gaps
- Exact branch protection rules must be verified in GitHub UI — not in git.
- Students need their own DigitalOcean + Cloudflare accounts for hands-on.

## Next
Lecture 060 — why staging environments matter.
