# Lecture 8 - GitHub Repo Setup | إعداد مستودع GitHub

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

## Recording Outline

- Explain why deployment needs a remote: hosting platform clones from GitHub.
- Show `git status`, `git add`, and `git commit` for the current project state.
- Open `.gitignore` and explain what must never be committed (`.env.local`, `node_modules`).
- Create a GitHub repository and connect with `git remote add origin`.
- Push the main branch; confirm files appear on GitHub.
- Mention branch strategy is minimal on Day 1; formal staging workflow arrives Day 7.
- Stress: every deployable increment should be traceable in git history.
- Preview DigitalOcean connecting to this repo in the next lecture.

## Verify in Repo

- Run `git log --oneline` and look for early commits (`2846932`, `7161301`, `c20f895`).
- Open `.gitignore` and confirm `.env*` and `node_modules` are excluded.
- Confirm `git remote -v` shows a GitHub origin (if configured locally).

## Notes / Gaps

- Day 1 README was added then removed in branch history; current repo has `AGENTS.md` and `docs/` instead.
- No `package-lock.json` in some early states—Dockerfile handles yarn/pnpm lockfiles too.
- Production workflow later uses `development` → `production` branches (Day 7).

## Next

[Lecture 9 — Deploy to DigitalOcean (First Release)](./lecture-009-deploy-to-digitalocean-first-release.md)
