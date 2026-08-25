# Lecture 31 - Next.js Proxy | البروكسي في Next.js

## Goal

Explain what `proxy.ts` does in Next.js 16: run edge logic before a request reaches a route — redirects, host checks, and (later) auth gates.

## Implementation Status

Implemented (proxy exists; auth cases 4a–4d added Day 10)

## Key Files (as implemented today)

- `proxy.ts` — `proxy()` function + `config.matcher`
- `next.config.ts` — app config (proxy is separate from config)

## What Was Built

On Day 4, students learned that `proxy.ts` exports a `proxy(request)` handler (formerly `middleware.ts` in older Next.js). It inspects `request.headers.get("host")` and `request.nextUrl.pathname`, then returns `NextResponse.redirect()` or `NextResponse.next()`. The `config.matcher` excludes `/api`, static assets, and `favicon.ico`.

## Recording Outline

- Position proxy as the front door: runs before `page.tsx` renders.
- Show file location: `proxy.ts` at project root (same level as `app/`).
- Read `export async function proxy(request: NextRequest)`.
- Explain `NextResponse.redirect(new URL(...))` vs `NextResponse.next()`.
- Introduce `ADMIN_HOSTS` and `PUBLIC_HOSTS` arrays.
- Walk Case 1: public host + `/dashboard` → redirect to `/`.
- Walk Case 2: admin host `/` → redirect to `/dashboard`.
- Walk Case 3: admin host + non-dashboard public paths → `/dashboard` (except `/login`, `/not-authorized` added later).
- Show `config.matcher` and why favicon/static files are excluded (`a225fd3` commit).
- Mention Day 10 addition: `getToken()` JWT checks for admin routes — preview only here.
- Transition to shipping the first proxy version.

## Verify in Repo

- `proxy.ts` exports `proxy` and `config.matcher`.
- Matcher excludes `api/`, `_next/static`, `_next/image`, `sw.js`, `favicon.ico`.
- `ADMIN_HOSTS` includes `admin.wazifa.app` and `dev-admin.wazifa.app`.

## Notes / Gaps

- Day 4 proxy had no auth — students reading today's file should treat Cases 4a–4d as Day 10 overlay.
- Infinite redirect loop debugging (`db360db`) is a key teaching moment from Day 4 commits.
- Local dev may use `localhost:3000` — host rules target deployed subdomains; document local testing limits.

## Next

[Lecture 32 - Ship proxy.ts](./lecture-032-ship-proxy-ts.md)
