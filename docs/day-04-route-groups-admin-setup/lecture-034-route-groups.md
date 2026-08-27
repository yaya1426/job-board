# Lecture 34 - Route Groups: Why + How? | مجموعات المسارات: لماذا وكيف؟

## Goal

Teach route groups — folders wrapped in parentheses like `(client)` and `(admin)` — that organize code without adding URL segments.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `app/(client)/` — public product pages (`/`, `/jobs`, …)
- `app/(admin)/dashboard/` — admin pages under `/dashboard/...`
- `app/(auth)/` — login/signup (added later; uses `/login`, `/signup` URLs)

## What Was Built

Commit `1ccf19d` introduced route groups. Public pages moved from `app/jobs/...` into a grouped folder (initially `(app)`, renamed to `(client)` in Day 5). Admin pages live under `app/(admin)/dashboard/`. Parentheses strip the group name from the URL: `(client)/jobs/page.tsx` → `/jobs`, not `/client/jobs`.

## Implementation steps

### Step 1: Review the problem route groups solve

Two app shells (public + admin), one `app/` tree, no extra URL segments.

### Step 2: Create `(client)` route group

Move Day 3 public routes into the group (URLs unchanged):

```bash
mkdir -p app/(client)
# move app/page.tsx → app/(client)/page.tsx
# move app/jobs/     → app/(client)/jobs/
```

Resulting tree:

```
app/
├── layout.tsx
├── (client)/
│   ├── page.tsx              → /
│   └── jobs/
│       ├── page.tsx          → /jobs
│       └── [id]/page.tsx     → /jobs/:id
```

### Step 3: Create `(admin)` route group

```bash
mkdir -p app/(admin)/dashboard
```

```
app/
└── (admin)/
    └── dashboard/
        └── page.tsx          → /dashboard
```

Parentheses are required — `(client)` not `client`.

### Step 4: Verify URLs are unchanged

| File | URL |
|------|-----|
| `app/(client)/jobs/page.tsx` | `/jobs` (not `/client/jobs`) |
| `app/(admin)/dashboard/page.tsx` | `/dashboard` (not `/admin/dashboard`) |

### Step 5: Preview per-group layouts (Day 5)

- `app/(client)/layout.tsx` — navbar + footer (Lecture 45).
- `app/(admin)/dashboard/layout.tsx` — sidebar (Lecture 46).
- `app/(auth)/` — login/signup without public navbar (later).

## Verify
- `app/(client)/jobs/page.tsx` serves `/jobs` (not `/client/jobs`).
- `app/(admin)/dashboard/page.tsx` serves `/dashboard`.
- No folder literally named `client` or `admin` appears in the URL path.

## Outcome

Documents route groups — folders wrapped in parentheses like `(client)` and `(admin)` — that organize code without adding URL segments.

## Notes / Gaps

- Historical rename `(app)` → `(client)` happened early Day 5 — mention when grepping git history.
- Route groups can nest; this project keeps admin under `(admin)/dashboard/` for clear `/dashboard` prefix.
- `(auth)` is post-Day 4 but follows the same grouping pattern.

## Next

[Lecture 35 - Project Milestone: Admin Routes](./lecture-035-admin-routes-milestone.md)
