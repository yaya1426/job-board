# Lecture 21 - App Router vs Pages Router | App Router مقابل Pages Router

## Goal

Give students a practical comparison so they know why this course uses the App Router and what Pages Router habits to leave behind.

## Implementation Status

External (concept lecture; no code change required)

## Key Files (as implemented today)

- `app/` — App Router entry (this project has no `pages/` directory)
- `next.config.ts` — Next.js 16 config with `output: "standalone"`

## What Was Built

No new routes. Students understand migration context: this codebase is App Router-only. Pages Router used `pages/index.tsx`, `pages/jobs/[id].tsx`, and `getServerSideProps` / `getStaticProps`; App Router uses `app/.../page.tsx` and async Server Components.

## Recording Outline

- State clearly: **wazifa.app uses the App Router only** — there is no `pages/` folder.
- Compare file placement: `pages/jobs/index.tsx` vs `app/(client)/jobs/page.tsx`.
- Compare data fetching: `getServerSideProps` return props vs `async function Page()` that awaits data directly.
- Compare layouts: `_app.tsx` + per-page layout vs nested `layout.tsx` files.
- Compare routing: `useRouter` from `next/router` vs `next/navigation` in App Router.
- Compare dynamic segments: `[id].tsx` vs `[id]/page.tsx`.
- Note Next.js 16 defaults to App Router and Turbopack for dev.
- Explain why the course commits to App Router: layouts, Server Components, and long-term Next.js direction.
- Warn against mixing patterns from old tutorials (`pages/` + `app/` in one app is possible but confusing for learners).
- Transition: start building from the root layout inward.

## Verify in Repo

- No `pages/` directory at repo root.
- `package.json` shows Next.js `16.x` and React `19.x`.
- All routes live under `app/`.

## Notes / Gaps

- Some third-party docs still show Pages Router examples; students should filter for App Router.
- `proxy.ts` replaces `middleware.ts` naming in Next.js 16 — covered on Day 4, not Day 3.

## Next

[Lecture 22 - Root Layout](./lecture-022-root-layout.md)
