# Lecture 65 - Recap Day (7)

## Goal
Summarize Day 7: staging as a safety net, four-host domain model, branch workflow, release tags — and the single code touchpoint (`proxy.ts`).

## Implementation Status
**Complete.**

## Key Files
- `proxy.ts`
- `docs/day-07-staging-branch-rules/README.md`
- All lecture files 059–065

## What Was Built
| Topic | In repo? | Where |
|-------|----------|-------|
| Staging client URL | External | `dev.wazifa.app` |
| Staging admin URL | External + proxy | `dev-admin.wazifa.app`, `proxy.ts` |
| Development branch | Git | merge history |
| Branch rules | GitHub settings | — |
| Release tags | Git | `day-*-release` tags |
| Proxy dev hosts | Code | `4a67ba3` |

## Implementation steps
### Step 1

Review four URLs and which branch deploys where:
- `dev.wazifa.app` / `dev-admin.wazifa.app` ← `development`
- `wazifa.app` / `admin.wazifa.app` ← `main` + release tag

### Step 2

Open `proxy.ts` diff — the only code students merge for Day 7:

```ts
const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
const PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"];
```

### Step 3

Trace one full release: feature branch → PR to `development` → test on `dev.*` → PR to `main` → tag → prod deploy.

### Step 4

Compare Day 6 (UI on mock data, local-only) with Day 7 (how we ship UI safely to shared staging).

### Step 5

List Day 8: Server Actions and services replace direct mock imports.

### Verify

```bash
git log --oneline --grep="Day 7"
git show 4a67ba3 --stat
```

- `proxy.ts` has four host constants.
- README documents external vs in-repo work split.
- **Current repo:** Day 10 auth rules layered on top of Day 7 host routing in `proxy.ts`.

### End State

Day 7 complete: staging safety net, four-host model, branch workflow, release tags, and `proxy.ts` dev hostnames. Ready for Day 8 backend work on a feature branch.

## Verify
```bash
git log --oneline --grep="Day 7"
git show 4a67ba3 --stat
```

- `proxy.ts` has four host constants.
- README documents external vs in-repo work split.

## Notes/Gaps
- Re-verify GitHub branch protection and DO branch mapping when re-recording — dashboards change.
- Auth proxy rules (Day 10) layered on top of Day 7 host routing.

## Next
Day 8 — backend setup with Server Actions, zod, services, and `useActionState`.
