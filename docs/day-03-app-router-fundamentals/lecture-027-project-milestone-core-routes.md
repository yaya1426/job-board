# Lecture 27 - Project Milestone: Core Routes | معلم المسارات الأساسية

## Goal

Complete the Day 3 routing milestone: home (`/`), jobs list (`/jobs`), and dynamic job details (`/jobs/[id]`) working end-to-end in the deployed app.

## Implementation Status

Implemented (routes exist; current pages evolved with DB, layouts, and apply flow in later days)

## Key Files (as implemented today)

- `app/(client)/page.tsx`
- `app/(client)/jobs/page.tsx`
- `app/(client)/jobs/[id]/page.tsx`
- `app/layout.tsx`

## What Was Built

Commit `1a56240` ("Day 3: Core Routes for Jobs") added the three public routes. Originally at `app/page.tsx`, `app/jobs/page.tsx`, and `app/jobs/[id]/page.tsx`. All three URLs were verified locally with navigation between them.

## Implementation steps

### Step 1: Confirm all three `page.tsx` files exist

| Route | Day 3 path | Current path |
|-------|-----------|--------------|
| `/` | `app/page.tsx` | `app/(client)/page.tsx` |
| `/jobs` | `app/jobs/page.tsx` | `app/(client)/jobs/page.tsx` |
| `/jobs/[id]` | `app/jobs/[id]/page.tsx` | `app/(client)/jobs/[id]/page.tsx` |

### Step 2: Review the navigation flow

1. Inspect `http://localhost:3000/` — home renders.
2. Navigate to `/jobs` — listing renders.
3. Inspect `/jobs/<any-id>` — details page shows the id (or job data after Day 8).
4. Click `← ALL POSITIONS` — returns to `/jobs`.

### Step 3: Anchor in git history

```bash
git show 1a56240 --stat
```

Review original file paths from the Day 3 milestone commit.

### Step 4: Map folder tree alongside URLs

```
app/
├── layout.tsx          ← wraps all three routes
├── page.tsx            → /
└── jobs/
    ├── page.tsx        → /jobs
    └── [id]/page.tsx   → /jobs/:id
```

### Step 5: Name what is intentionally not built yet

- Admin routes (Day 4)
- Route groups `(client)` (Day 4)
- Navbar/footer layout (Day 5)
- Database + services (Days 8–9)
- Auth (Day 10)

## Verify
- All three routes resolve on `localhost:3000`.
- `git log --oneline` includes `1a56240` or equivalent Day 3 message.
- Navigation home → jobs → detail → back works.
- `git log --oneline` includes `1a56240` or equivalent Day 3 commit message.
- Current paths under `app/(client)/` mirror original Day 3 URLs.

## Outcome

Three public routes (`/`, `/jobs`, `/jobs/[id]`) work end-to-end locally with navigation between them, anchored by commit `1a56240`.

## Notes / Gaps

- Pages now load jobs from MongoDB via services — Day 3 may have used static placeholders.
- Client layout/navbar (Day 5) and auth (Day 10) significantly changed the visual experience.
- Route group move `(client)` happened Day 4–5; URLs unchanged.

## Next

[Lecture 28 - Ship It: Deploy Checkpoint](./lecture-028-ship-it-deploy-checkpoint.md)
