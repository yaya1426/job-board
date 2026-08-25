# Day 7 - Staging and Branch Rules

## Goal

Introduce a safer release workflow with development/staging environments, branch rules, and production release tagging.

## Lectures Covered

- Lecture 59 - Day 7 Plan
- Lecture 60 - Why We Need Staging
- Lecture 61 - Setup Development Branch & App Dev Environment
- Lecture 62 - Setup Admin Environment + Proxy
- Lecture 63 - Branch Rules for develop and main
- Lecture 64 - Tagging Production Releases
- Lecture 65 - Recap Day 7

## Lecture Files

- [Lecture 059 - Day 7 Plan](./lecture-059-day-7-plan.md)
- [Lecture 060 - Why We Need Staging](./lecture-060-why-we-need-staging.md)
- [Lecture 061 - Setup Development Branch & App Dev Environment](./lecture-061-setup-development-branch-and-app-dev-environment.md)
- [Lecture 062 - Setup Admin Environment + Proxy](./lecture-062-setup-admin-environment-and-proxy.md)
- [Lecture 063 - Branch Rules for develop and main](./lecture-063-branch-rules-for-develop-and-main.md)
- [Lecture 064 - Tagging Production Releases](./lecture-064-tagging-production-releases.md)
- [Lecture 065 - Recap Day 7](./lecture-065-recap-day-7.md)

## Commit Evidence

Commits found for this day:

- `4a67ba3` - Day 7: proxy config for new dev domains
- `b95d362` - Merge pull request #1 from yaya1426/feature/day-7-proxy-config
- `d2e71f5` - Merge pull request #2 from yaya1426/develop

Key file changed:

- `proxy.ts`

## Final State

By the end of the day, the project context included:

- Production client domain: `wazifa.app`.
- Production admin domain: `admin.wazifa.app`.
- Development/staging client domain: `dev.wazifa.app`.
- Development/staging admin domain: `dev-admin.wazifa.app`.
- Proxy logic aware of the development admin/client hostnames.
- A branch workflow around feature branches, development, and production.

## What Happened Outside the Repo

Most of the branch-rules and deployment work likely happened in GitHub and DigitalOcean settings, not in code. The only directly visible code change is the proxy update for development domains.

## Teaching Narrative

This day explains that professional deployment is not just `git push main`.

Students learn why a staging environment exists:

- Test changes on a real URL.
- Separate development from production.
- Use branch rules to reduce accidental production changes.
- Use tags to identify shipped releases.

## Notes

- The repo history includes merge commits from feature/development branches.
- Exact branch protection settings should be verified in GitHub, because they are not represented in the repository files.
