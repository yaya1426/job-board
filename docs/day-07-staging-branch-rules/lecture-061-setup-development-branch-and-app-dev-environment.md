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

## Recording Outline

1. Create `development` branch from `main`/`production`.
2. In DigitalOcean: duplicate app or add branch deploy rule for `development`.
3. Set env vars (`MONGO_URI`, `NEXTAUTH_URL`, etc.) for dev scope.
4. Add Cloudflare `dev` DNS record.
5. Push to `development` and verify `https://dev.wazifa.app` loads.

## Verify in Repo

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
