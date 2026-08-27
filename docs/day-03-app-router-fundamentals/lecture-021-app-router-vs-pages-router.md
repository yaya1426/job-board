# Lecture 21 - App Router vs Pages Router | App Router مقابل Pages Router

## Goal

Contrast the App Router with the Pages Router: why this course uses `app/` and which Pages Router habits to leave behind.

## Implementation Status

External (concept lecture; no code change required)

## Key Files (as implemented today)

- `app/` — App Router entry (this project has no `pages/` directory)
- `next.config.ts` — Next.js 16 config with `output: "standalone"`

## What Was Built

No new routes. Documents migration context: this codebase is App Router-only. Pages Router used `pages/index.tsx`, `pages/jobs/[id].tsx`, and `getServerSideProps` / `getStaticProps`; App Router uses `app/.../page.tsx` and async Server Components.

## Implementation steps

### Step 1: Confirm App Router-only project

From repo root, verify there is **no** `pages/` directory. All routes live under `app/`.

### Step 2: Compare file placement side by side

| Pages Router (old tutorials) | App Router (this course) |
|------------------------------|--------------------------|
| `pages/index.tsx` → `/` | `app/(client)/page.tsx` → `/` |
| `pages/jobs/index.tsx` → `/jobs` | `app/(client)/jobs/page.tsx` → `/jobs` |
| `pages/jobs/[id].tsx` → `/jobs/:id` | `app/(client)/jobs/[id]/page.tsx` → `/jobs/:id` |

### Step 3: Compare data fetching

Pages Router pattern (not in this repo):

```tsx
// pages/jobs/[id].tsx — Pages Router (contrast only)
export async function getServerSideProps({ params }) {
  const job = await fetchJob(params.id);
  return { props: { job } };
}
```

App Router pattern (this repo):

```15:17:app/(client)/jobs/[id]/page.tsx
async function JobDetailsPage({ params }: Props) {
  const { id } = await params;
  const result = await getJob(id);
```

Data is fetched directly inside the async Server Component — no `getServerSideProps`.

### Step 4: Compare layouts

- Pages Router: `_app.tsx` wraps everything; per-page layouts are manual.
- App Router: nested `layout.tsx` files (`app/layout.tsx` → route-group layouts on Day 5).

### Step 5: Compare navigation imports

- Pages Router: `useRouter` from `next/router`.
- App Router: `useRouter`, `usePathname` from `next/navigation` (client components only).

## Verify
- `package.json` shows Next.js `16.x`.
- No `pages/` folder exists.
- [ ] You can name one App Router advantage relevant to this course (nested layouts, Server Components).
- No `pages/` directory at repo root.
- `package.json` shows Next.js `16.x` and React `19.x`.
- All routes live under `app/`.

## Outcome

App Router-only project with nested layouts and async Server Components instead of `getServerSideProps` / `getStaticProps`.

## Notes / Gaps

- Filter third-party docs for App Router examples; many still show Pages Router patterns.
- `proxy.ts` replaces `middleware.ts` naming in Next.js 16 — covered on Day 4, not Day 3.

## Next

[Lecture 22 - Root Layout](./lecture-022-root-layout.md)
