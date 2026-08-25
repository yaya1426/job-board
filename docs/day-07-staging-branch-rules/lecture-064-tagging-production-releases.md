# Lecture 64 - Tagging Production Releases

## Goal

Use Git tags to mark production releases so deployed code is traceable to a known commit.

## Implementation Status

**Complete (process).** Course uses annotated tags (e.g. `day-07-release`) after promoting to production. Verify tags in remote.

## Key Files

- Git tags on release commits
- `docs/day-07-staging-branch-rules/README.md`

## What Was Built

Release tagging practice:

```bash
git tag -a day-07-release -m "Day 7: staging and branch rules"
git push origin day-07-release
```

Tags become the audit trail: which code ran in prod at which time.

## Recording Outline

1. Explain semver vs course milestone tags (`day-NN-release`).
2. After merging development → main and confirming prod deploy, create annotated tag.
3. Push tag to origin; show on GitHub Releases/tags UI.
4. Link tag to DigitalOcean deployment commit hash.
5. Rollback story: redeploy previous tag.

## Verify in Repo

```bash
git tag -l "day-*"
```

- Tags may exist on remote even if not listed locally — `git fetch --tags`.
- Day 10+ README references similar release tag flow.

## Notes/Gaps

- Tags are not enforced by CI in this repo yet.
- Changelog generation is manual.

## Next

Lecture 065 — Day 7 recap.
