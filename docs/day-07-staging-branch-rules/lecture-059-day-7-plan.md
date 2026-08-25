# Lecture 59 - Day 7 Plan

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

## Recording Outline

1. Contrast Day 6 (all local/mock) with need for a shared staging URL.
2. Draw the environment map: prod vs dev, client vs admin (four hostnames).
3. Preview GitHub branch workflow diagram.
4. Show that almost all work is dashboard config — except `proxy.ts`.
5. List lectures 059–065.

## Verify in Repo

- Day 7 README documents lectures and commit `4a67ba3`.
- `proxy.ts` lists four host constants.

## Notes/Gaps

- Exact branch protection rules must be verified in GitHub UI — not in git.
- Students need their own DigitalOcean + Cloudflare accounts for hands-on.

## Next

Lecture 060 — why staging environments matter.
