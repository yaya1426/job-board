# Lecture 8 - Github Repo Setup | إعداد مستودع GitHub

## Goal

Put the project under version control and push it to GitHub so deployment can pull from a remote repository.

## Implementation Status

Implemented (repo history includes Day 1 commits; `.gitignore` excludes `node_modules`, `.next`, and env files).

## Key Files (as implemented today)

- `.gitignore`
- `README.md` (added in commit `2846932`, later evolved)
- `.git/` (repository metadata)

## What Was Built

- Git repository initialized locally with project files tracked.
- `.gitignore` excluding `node_modules`, `.next`, build artifacts, and local env files.
- Remote on GitHub connected for push/pull.
- Initial commit history capturing boilerplate: `tsconfig.json`, starter app files, `.gitignore`.
- Foundation for DigitalOcean App Platform to build from the GitHub source.

## Implementation steps

### Step 1 — Initialize Git locally
- Deployment requires a remote: App Platform clones from GitHub.
- Initialize and make the first commit:

```bash
git init
git add .
git commit -m "Initial Next.js scaffold"
```

### Step 2 — Review .gitignore
- Inspect `.gitignore` — what must never be committed:

```1:41:.gitignore
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

- Key exclusions: `node_modules`, `.next/`, `.env*` (secrets stay local).

### Step 3 — Create GitHub repository and connect remote
- Create a new repository on GitHub (empty, no README if you already have local commits).
- Connect and push:

```bash
git remote add origin https://github.com/<your-user>/job-board.git
git branch -M main
git push -u origin main
```

- Confirm files appear on GitHub in the browser.

### Step 4 — Verify commit history
- Run `git log --oneline` and look for early Day 1 commits (`2846932`, `7161301`, `c20f895`).
- Every deployable increment should be traceable in git history.

### Step 5 — Set branch expectations
- Day 1 uses a single `main` branch.
- Formal staging workflow (`feature/* → development → production`) arrives Day 7.

## Verify
- [ ] `git log --oneline` shows early scaffold commits.
- [ ] `.gitignore` excludes `.env*` and `node_modules`.
- [ ] `git remote -v` shows a GitHub origin (if configured locally).
- [ ] GitHub repository displays project files after push.
- [ ] No `.env.local` or secrets are committed.

## Outcome

- Project is under version control with a `.gitignore` that protects secrets and build artifacts.
- Remote on GitHub is connected so DigitalOcean App Platform can build from source.

## Notes / Gaps

- Day 1 README was added then removed in branch history; current repo has `AGENTS.md` and `docs/` instead.
- No `package-lock.json` in some early states—Dockerfile handles yarn/pnpm lockfiles too.
- Production workflow later uses `development` → `production` branches (Day 7).

## Next

[Lecture 9 — Deploy to DigitalOcean (First Release)](./lecture-009-deploy-to-digitalocean-first-release.md)
