# Lecture 28 - Ship It: Deploy Checkpoint | نقطة نشر اليوم

## Goal

Deploy the Day 3 routing milestone to the staging/production URL and verify the three routes work on the real host, not just localhost.

## Implementation Status

External (deployment workflow; routes Implemented in repo)

## Key Files (as implemented today)

- `Dockerfile` — container build (present from Day 1+)
- `next.config.ts` — `output: "standalone"`
- `.github/` or DigitalOcean App Platform config (if used for CI/deploy)

## What Was Built

Day 3 work was pushed through the project branch workflow and `dev.wazifa.app` (or production) was confirmed to serve `/`, `/jobs`, and `/jobs/<id>`. Routing must run on a real URL—not only localhost.

## Implementation steps

### Step 1: Pre-deploy checklist

Confirm these files are committed:

- `app/layout.tsx`
- `app/page.tsx` (or `app/(client)/page.tsx` if already moved)
- `app/jobs/page.tsx`
- `app/jobs/[id]/page.tsx`

### Step 2: Push through course branch workflow

```bash
git status
git push origin <your-feature-branch>
# merge to development per course rules
```

### Step 3: Watch DigitalOcean build

- Review App Platform dashboard.
- Confirm build succeeds (no TypeScript errors in route files).
- `next.config.ts` uses `output: "standalone"` for Docker deploy.

### Step 4: Test on staging URL

On `dev.wazifa.app` (or your staging host):

1. `/` — home loads.
2. `/jobs` — jobs listing loads.
3. `/jobs/test-id` — dynamic route resolves (placeholder or real job).

### Step 5: Compare localhost vs deployed

Routing behavior should match. Note: subdomains (`admin.wazifa.app`) are Day 4 — only public host matters here.

## Verify
- Latest commit includes Day 3 route files.
- Deploy succeeds on App Platform.
- Public staging URL loads home and `/jobs` without 404.
- Deploy succeeds on App Platform (or document if local env differs).

## Outcome

Day 3 routing is deployed and verified on a real host—`/`, `/jobs`, and `/jobs/<id>` match localhost behavior.

## Notes / Gaps

- Day 3 deploy had no MongoDB dependency for routing itself; later days require `MONGO_URI`.
- Subdomain routing (`admin.wazifa.app`) is Day 4 — only public host matters here.
- `force-dynamic` layouts came later for Mongoose; Day 3 may have been statically prerender-friendly.

## Next

[Lecture 29 - Recap Day (3)](./lecture-029-recap-day-3.md)
