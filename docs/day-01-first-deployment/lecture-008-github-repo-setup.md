# Lecture 8 - Github Repo Setup

## Goal

Put the app in Git and on GitHub so DigitalOcean App Platform can clone it for the first deploy.

## Implementation Status

**Done on Day 1.** This GitHub repo is still the deploy source.

## What We Really Did

Git was initialized locally and commits were made **file-by-file**, not as a single “Initial Next.js scaffold” commit. Same-day history:

| Commit | Message |
|--------|---------|
| `2846932` | Add Readme.md |
| `1cef65d` | Add tsconfig.json |
| `c20f895` | Add .gitignore |
| `7161301` | Add all boilerplate files |
| `6c1b9eb` | Cahnge tilte in page.tsx |
| `69a7f8f` | Add Dockerfile |
| `e80545f` | Add next.js standalone |

Remote: GitHub (`yaya1426/job-board`). App Platform builds from that remote.

Day 1 used a single default branch (`main`). Feature / `development` / production rules are Day 7.

`.gitignore` is the create-next-app default. Important lines:

- `/node_modules`
- `/.next/`
- `.env*` — local secrets never committed
- `next-env.d.ts` — generated, not committed

There is still no `.dockerignore`.

The Day 1 root `README.md` was the stock create-next-app “Getting Started / Deploy on Vercel” file. It was later removed; course narrative now lives in `docs/` and `AGENTS.md`.

## Implementation steps

### 1. Initialize and commit

```bash
git init
git add .
git commit -m "Add Next.js scaffold"
```

In this course recording, files were added as several small commits (table above). Either style is fine; the remote must exist before App Platform can deploy.

### 2. Confirm `.gitignore`

Secrets (`.env*`), `node_modules`, and `.next/` must not be tracked.

### 3. Create the GitHub repo and push

```bash
git remote add origin https://github.com/<your-user>/job-board.git
git branch -M main
git push -u origin main
```

Confirm files appear on GitHub in the browser.

### 4. Keep Day 1 branching simple

One branch. Staging workflow is Day 7.

## Verify

- [ ] `git log --oneline` shows the Day 1 commits above
- [ ] `.gitignore` includes `.env*` and `/node_modules`
- [ ] `git remote -v` points at GitHub
- [ ] No `.env.local` in the tree on GitHub

## Outcome

The project is versioned and cloned from GitHub. Lecture 9 can attach App Platform to that repo.

## Next

[Lecture 9 — Deploy to DigitalOcean (First Release)](./lecture-009-deploy-to-digitalocean-first-release.md)
