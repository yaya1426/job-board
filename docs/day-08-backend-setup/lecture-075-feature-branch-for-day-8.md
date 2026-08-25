# Lecture 75 - Feature Branch for Day 8

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

## Recording Outline

1. Recap Day 7 branch rules slide.
2. Create feature branch before Lecture 71 coding.
3. Make incremental commits: action, zod, service refactor chunks.
4. Push and open PR; show CI/build on DO preview if available.
5. Test create job on staging; merge when green.

## Verify in Repo

```bash
git log --oneline --grep="Day 8"
```

Duplicate commit hashes (`b4ba20f` / `9394328`) indicate merge/rebase history — same features, not duplicate lessons.

## Notes/Gaps

- Solo learners may commit directly to `development` — note team vs solo tradeoff.
- Keep PRs small: backend refactor PRs are easier to review than 15-lecture mega-PR.

## Next

Lecture 076 — first jobs service refactor (extract from mock data module).
