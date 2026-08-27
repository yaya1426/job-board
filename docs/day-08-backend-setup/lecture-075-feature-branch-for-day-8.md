# Lecture 75 - Feature Branch for Day (8)

## Goal
Practice the Day 7 branch workflow on a Day 8 feature branch: isolate backend changes, open PR to `development`, deploy to staging before production.

## Implementation Status
**Complete (process).** Day 8 commits exist on feature branches merged via PR (pattern established Day 7).

## Key Files
- Git branch `feature/day-8-*` (naming convention)
- GitHub PR into `development`
- `docs/day-08-backend-setup/README.md`

## What Was Built
Workflow rehearsal:

```bash
git checkout development
git pull
git checkout -b feature/day-8-backend-setup
# ... Day 8 commits ...
git push -u origin feature/day-8-backend-setup
# Open PR → development → test dev.wazifa.app → merge
```

## Implementation steps
### Step 1

Review Day 7 branch rules: feature → `development` → `main` + tag.

### Step 2

Before Lecture 071 coding, create the feature branch:

```bash
git checkout development
git pull
git checkout -b feature/day-8-backend-setup
```

### Step 3

Make incremental commits as you progress:
- Server Action + create job service
- zod validation
- `useActionState` wiring
- Service refactors (jobs, applications, candidates)

### Step 4

Push and open PR to `development`:

```bash
git push -u origin feature/day-8-backend-setup
```

### Step 5

Test create job on `dev-admin.wazifa.app` (or `dev.wazifa.app` for public list). Merge when staging is green.

### Verify

```bash
git log --oneline --grep="Day 8"
```

- Feature branch commits visible in PR history.
- Staging deploy succeeds after merge to `development`.
- Duplicate commit hashes in history (`b4ba20f` / `9394328`) indicate merge/rebase — same features.

### End State

Day 8 work shipped via the Day 7 workflow. Backend changes validated on staging before production promote. Solo readers may commit directly to `development` — note the tradeoff.

## Verify
```bash
git log --oneline --grep="Day 8"
```

Duplicate commit hashes (`b4ba20f` / `9394328`) indicate merge/rebase history — same features, not duplicate lessons.

## Notes/Gaps
- Solo readers may commit directly to `development` — note team vs solo tradeoff.
- Keep PRs small: backend refactor PRs are easier to review than 15-lecture mega-PR.

## Next
Lecture 076 — first jobs service refactor (extract from mock data module).
