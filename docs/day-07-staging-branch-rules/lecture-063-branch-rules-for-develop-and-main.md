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

## Implementation steps
### Step 1

Document the workflow diagram:

```txt
feature/day-N-*  →  development  →  main/production
         PR              PR + staging test      tag + prod deploy
```

### Step 2

In GitHub → Settings → Branches, protect `main`/`production`:
- Require pull request before merging
- Optionally require review
- Disallow direct pushes

### Step 3

Optionally protect `development` with PR requirement (team setting).

### Step 4

Trace a real example from repo history: `feature/day-7-proxy-config` → PR #1 → merge `b95d362` into `development`.

### Step 5

Tie DigitalOcean deploy rules: `development` branch → `dev.wazifa.app` app; `main` → production app. Merge to `main` only after staging sign-off.

### Verify

```bash
git log --oneline --merges | head -5
```

- Feature branch naming visible in merge commits.
- No branch protection config files in repo (GitHub-only).
- Readers can see PR history on GitHub for `feature/day-7-proxy-config`.

### End State

Branch rules are configured in GitHub (not in git). Feature work flows through PRs to `development` for staging validation, then to `main` for production. Solo readers may simplify — note the tradeoff.

## Verify
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
