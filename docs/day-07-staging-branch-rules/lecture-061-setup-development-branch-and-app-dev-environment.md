# Lecture 61 - Setup Development Branch & App Dev Environment

## Goal
Create a `development` branch workflow and a second DigitalOcean App Platform deployment pointing at `dev.wazifa.app`.

## Implementation Status
**Complete (external ops).** Merge history shows `develop` branch integration (`d2e71f5`). Dev app configured on DigitalOcean with staging subdomain.

## Key Files
- GitHub: `development` (or `develop`) branch
- DigitalOcean App Platform: dev app component
- Cloudflare DNS: `dev` CNAME → DO dev app
- `.env` / DO env vars scoped to dev app

## What Was Built
- Long-lived development branch receiving feature merges.
- Second DO app (or branch-based deploy) serving `dev.wazifa.app`.
- Build uses same `Dockerfile`; `MONGO_URI` and secrets may differ per app.

## Implementation steps
### Step 1

In GitHub, create a long-lived `development` branch from `main`/`production`:

```bash
git checkout main
git pull
git checkout -b development
git push -u origin development
```

### Step 2

In DigitalOcean App Platform, create a second app (or configure branch deploy) pointing at the `development` branch. Use the same `Dockerfile` from the repo root.

### Step 3

Set dev-scoped env vars on the DO dev app:
- `MONGO_URI` — separate Atlas database (not production data)
- `NEXTAUTH_URL=https://dev.wazifa.app`
- `NEXTAUTH_SECRET` — unique secret for dev

Ensure `MONGO_URI` has **Run and build time** scope (Dockerfile `ARG MONGO_URI`).

### Step 4

In Cloudflare DNS, add `dev` CNAME record pointing to the DigitalOcean dev app URL.

### Step 5

Push a test commit to `development` and verify `https://dev.wazifa.app` loads the client app.

### Verify

```bash
git log --oneline --grep="develop"
# -> d2e71f5 Merge pull request #2 from yaya1426/develop
```

- Dev app deploys from `development` branch.
- `dev.wazifa.app` resolves and serves the app over HTTPS.
- Dev `MONGO_URI` points at a non-production database.

### End State

A shared staging URL (`dev.wazifa.app`) deploys automatically from the `development` branch. Production (`wazifa.app`) remains on `main`/`production`. Branch naming may be `development` or `develop` — align with your fork.

## Verify
```bash
git log --oneline --grep="develop"
# -> d2e71f5 Merge pull request #2 from yaya1426/develop
```

- `NEXTAUTH_URL` for dev should be `https://dev.wazifa.app` (or local override).
- Dockerfile `ARG MONGO_URI` pattern unchanged from Day 1.

## Notes/Gaps
- Branch name in README says `development`; git history shows `develop` — align naming in course materials.
- Dev database should not share production data.

## Next
Lecture 062 — admin staging host and proxy update.
