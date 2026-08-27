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

## Implementation steps
### Step 1

After merging `development` → `main` and confirming production deploy is healthy, check out `main` locally:

```bash
git checkout main
git pull
```

### Step 2

Create an annotated tag on the release commit:

```bash
git tag -a day-07-release -m "Day 7: staging and branch rules"
```

### Step 3

Push the tag to origin:

```bash
git push origin day-07-release
```

### Step 4

On GitHub → Releases/Tags, confirm the tag appears and note the commit hash.

### Step 5

In DigitalOcean production app, verify the deployed commit matches the tagged commit. Describe rollback: redeploy a previous tag's commit.

### Verify

```bash
git tag -l "day-*"
git fetch --tags  # if tags only on remote
```

- Tag exists on remote with message describing the milestone.
- Production DO app commit hash matches tag.

### End State

Production releases are traceable to a known git tag. Course uses milestone tags (`day-NN-release`) rather than semver. Tags are manual — no CI enforcement in this repo yet.

## Verify
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
