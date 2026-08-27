# Lecture 32 - Ship it: Deploy proxy.ts | نشر ملف البروكسي

## Goal

Implement and deploy the first `proxy.ts` rules so public and admin hosts behave differently in staging/production.

## Implementation Status

Implemented

## Key Files (as implemented today)

- `proxy.ts`
- DigitalOcean App Platform app settings (runtime env, domains)
- Cloudflare DNS records for admin subdomains

## What Was Built

Day 4 added `proxy.ts`, iterated through redirect-loop fixes, host equality checks (`e6a880a`), and favicon exclusion. Commits `b7f83c2`, `375a025`, `9beaf96`, `db360db`, `e6a880a`, and `a225fd3` document the debugging trail. Deployed build must include the proxy file at repo root.

## Implementation steps

### Step 1: Create `proxy.ts` at repo root (Day 4 version — no auth)

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
const PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"];

function isDashboardPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  const pathname = request.nextUrl.pathname;

  const isAdminHost = ADMIN_HOSTS.includes(host);
  const isPublicHost = PUBLIC_HOSTS.includes(host);
  const isDashboardRoute = isDashboardPath(pathname);

  // Case 1: public host + /dashboard → /
  if (isPublicHost && isDashboardRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Case 2: admin host + / → /dashboard
  if (isAdminHost && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Case 3: admin host + non-dashboard → /dashboard
  if (isAdminHost && !isDashboardRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|sw\\.js|favicon\\.ico).*)"],
};
```

### Step 2: Normalize host comparison

Always `.toLowerCase()` on the host header. Use exact array membership — no partial string matches.

### Step 3: Debug redirect loops

Common bug: a catch-all rule redirects the redirect target. Fix with precise `pathname` checks per case. Commit `db360db` documents this fix.

### Step 4: Add temporary logging (remove before milestone)

```typescript
console.log("[proxy]", { host, pathname });
```

Deploy, read App Platform runtime logs, then remove.

### Step 5: Deploy and test Cases 1–3 on staging

- `dev.wazifa.app/dashboard` → redirects to `/`.
- `dev-admin.wazifa.app/` → redirects to `/dashboard`.
- `dev-admin.wazifa.app/jobs` → redirects to `/dashboard`.

## Verify
- `git log --oneline -- proxy.ts` shows Day 4 fix commits.
- No accidental redirect loop in `proxy.ts`.
- Staging hostname redirect matrix passes for Cases 1–3.
- `proxy.ts` has no accidental catch-all redirect loop.
- Staging: `wazifa.app/dashboard` redirects to `/` on public host.
- Staging: `admin.wazifa.app/` redirects to `/dashboard`.

## Outcome

Implement and deploy the first `proxy.ts` rules so public and admin hosts behave differently in staging/production.

## Notes / Gaps

- Local `localhost` won't trigger admin host rules without extra tooling.
- Auth redirects in current proxy are Day 10 — Day 4 checkpoint stops at host routing.
- `getServerSession()` does not work in proxy; Day 10 uses `getToken()` instead.

## Next

[Lecture 33 - Configure Admin Sub-domain](./lecture-033-configure-admin-sub-domain.md)
