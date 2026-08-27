# Lecture 31 - Next.js Proxy | البروكسي في Next.js

## Goal

Explain what `proxy.ts` does in Next.js 16: run edge logic before a request reaches a route — redirects, host checks, and (later) auth gates.

## Implementation Status

Implemented (proxy exists; auth cases 4a–4d added Day 10)

## Key Files (as implemented today)

- `proxy.ts` — `proxy()` function + `config.matcher`
- `next.config.ts` — app config (proxy is separate from config)

## What Was Built

Day 4 established that `proxy.ts` exports a `proxy(request)` handler (formerly `middleware.ts` in older Next.js). It inspects `request.headers.get("host")` and `request.nextUrl.pathname`, then returns `NextResponse.redirect()` or `NextResponse.next()`. The `config.matcher` excludes `/api`, static assets, and `favicon.ico`.

## Implementation steps

### Step 1: Position `proxy.ts` as the front door

File lives at repo root (same level as `app/`). Runs on every matched request before route rendering.

### Step 2: Read host constants

```5:6:proxy.ts
const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
const PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"];
```

These must match Cloudflare DNS hostnames exactly (case-insensitive after `.toLowerCase()`).

### Step 3: Review Day 4 redirect cases (no auth)

**Case 1** — public host blocks dashboard URLs:

```27:29:proxy.ts
  if (isPublicHost && isDashboardRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
```

**Case 2** — admin host root opens dashboard:

```34:36:proxy.ts
  if (isAdminHost && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
```

**Case 3** — admin host blocks public pages:

```42:44:proxy.ts
  if (isAdminHost && !isDashboardRoute && !isAllowedAdminPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
```

Day 4 version: Case 3 had no `isAllowedAdminPublicPath` — every non-dashboard admin path redirected to `/dashboard`. Login/not-authorized exceptions were added Day 10.

### Step 4: Read the matcher

```91:93:proxy.ts
export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|sw\\.js|favicon\\.ico).*)"],
};
```

Excludes API routes, static assets, service worker, and favicon from proxy processing.

### Step 5: Note Day 10 auth overlay (Cases 4a–4d)

Today's file also includes JWT checks via `getToken()`:

```52:80:proxy.ts
  if (isAdminHost || isDashboardRoute) {
    // ... getToken(), login redirect, role check ...
  }
```

Day 4 covers Cases 1–3 first; the auth block is a later layer (Day 10).

## Verify
- `proxy.ts` exports `proxy` and `config.matcher`.
- Matcher excludes `api/`, `_next/static`, `_next/image`, `sw.js`, `favicon.ico`.
- You can explain Cases 1–3 without referencing JWT.
- `ADMIN_HOSTS` includes `admin.wazifa.app` and `dev-admin.wazifa.app`.

## Outcome

Documents what `proxy.ts` does in Next.js 16: run edge logic before a request reaches a route — redirects, host checks, and (later) auth gates.

## Notes / Gaps

- Day 4 proxy had no auth — when reading today's file, treat Cases 4a–4d as Day 10 overlay.
- Infinite redirect loop debugging (`db360db`) is a key teaching moment from Day 4 commits.
- Local dev may use `localhost:3000` — host rules target deployed subdomains; document local testing limits.

## Next

[Lecture 32 - Ship proxy.ts](./lecture-032-ship-proxy-ts.md)
