# Lecture 29 - Recap Day (3) | ملخص اليوم الثالث

## Goal

Consolidate App Router fundamentals and preview Day 4: multiple product surfaces in one repo via proxy and route groups.

## Implementation Status

Implemented (Day 3 concepts and routes); Partial (full product features continue in later days)

## Key Files (as implemented today)

- `app/layout.tsx`
- `app/(client)/page.tsx`
- `app/(client)/jobs/page.tsx`
- `app/(client)/jobs/[id]/page.tsx`

## What Was Built

Day 3 delivered a deployable routing skeleton: file-system routes, root layout, nested `/jobs`, dynamic `[id]`, `params` reading, and `Link` navigation. URL ↔ folder mapping is explainable without memorizing framework magic.

## Implementation steps

### Step 1: Recap the mental model

- `app/` is the router.
- Folders = URL segments (skip parenthesized route groups).
- `page.tsx` publishes a URL; `layout.tsx` wraps children.

### Step 2: Recap the three routes + milestone commit

```bash
git show 1a56240 --stat
```

| URL | File (Day 3) | File (today) |
|-----|-------------|--------------|
| `/` | `app/page.tsx` | `app/(client)/page.tsx` |
| `/jobs` | `app/jobs/page.tsx` | `app/(client)/jobs/page.tsx` |
| `/jobs/:id` | `app/jobs/[id]/page.tsx` | `app/(client)/jobs/[id]/page.tsx` |

### Step 3: Recap dynamic params pattern

```tsx
type Props = { params: Promise<{ id: string }> };
const { id } = await params;
```

### Step 4: Recap `Link` vs `<a>`

Internal: `import Link from "next/link"`. External: `<a>` with `rel="noopener noreferrer"`.

### Step 5: Preview Day 4

- Problem: public site + admin dashboard, same codebase, different hostnames.
- Tools: `proxy.ts` + route groups `(client)` / `(admin)`.
- Next: `docs/day-04-route-groups-admin-setup/lecture-030-day-4-plan.md`.

## Verify
- You can navigate `/`, `/jobs`, `/jobs/<id>` locally.
- You can draw the folder tree from memory.
- No `pages/` directory — App Router only.
- `docs/day-03-app-router-fundamentals/README.md` lecture index is complete.

## Outcome

App Router fundamentals consolidated: file-system routes, layouts, dynamic params, and `Link` navigation. Day 4 adds host-based routing via `proxy.ts` and route groups.

## Notes / Gaps

- Authorization, database, and styled layouts are intentionally future days.
- Comparing old commits should expect simpler page content on Day 3.
- Next.js 16 `proxy.ts` replaces `middleware.ts` naming — introduced Day 4.

## Next

[Lecture 30 - Day (4) Plan](../day-04-route-groups-admin-setup/lecture-030-day-4-plan.md)
