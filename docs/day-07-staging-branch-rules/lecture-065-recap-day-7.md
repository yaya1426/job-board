# Lecture 65 - Recap Day 7

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

## Recording Outline

1. Recap four URLs and which branch deploys where.
2. Show `proxy.ts` diff — only change students merge.
3. Walk one full release: feature → develop → staging test → main → tag.
4. Contrast Day 6 (UI only) with Day 7 (how we ship UI safely).
5. Preview Day 8: Server Actions and services replace mock data access.

## Verify in Repo

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
