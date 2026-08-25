# Lecture 63 - Branch Rules for develop and main

## Goal

Establish branch workflow: feature branches merge into `development` for staging; `development` merges to `main`/`production` for releases.

## Implementation Status

**Complete (process).** Git history shows feature branches and merge PRs. Exact GitHub protection settings are outside the repo.

## Key Files

- GitHub repository settings (branch protection)
- Branch naming: `feature/*`, `development`, `main` or `production`

## What Was Built

Workflow rules (typical course setup):

```txt
feature/day-N-*  →  development  →  main/production
         PR              PR + staging test      tag + prod deploy
```

- No direct commits to `main`.
- Staging validates on `dev.*` before production promote.

## Recording Outline

1. Draw the three-branch diagram on screen.
2. Walk a real PR: `feature/day-7-proxy-config` → develop (`b95d362`).
3. Configure GitHub branch protection (require PR, optional reviews).
4. Show how DO auto-deploy ties branch to environment.
5. Emphasize: merge to main only after staging sign-off.

## Verify in Repo

```bash
git log --oneline --merges | head -5
# Includes feature/day-7-proxy-config and develop merges
```

- Feature branch naming visible in merge commit messages.
- No branch protection config files in repo (GitHub-only).

## Notes/Gaps

- Document actual default branch name (`main` vs `production`) for your fork.
- Students soloing may simplify to `main` + tags only — call out as tradeoff.

## Next

Lecture 064 — tagging production releases.
