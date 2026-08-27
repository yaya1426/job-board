# Lecture 105 - Protecting Admin Pages with Proxy | حماية صفحات الأدمن باستخدام البروكسي

## Goal
Block unauthenticated and non-admin users from admin dashboard routes using `getToken()` in `proxy.ts`, with dashboard layout defense in depth and a friendly `/not-authorized` page.

## Background
Server Components run **after** routing. For admin hosts, we want to stop bad requests **early** — before dashboard pages render.

`proxy.ts` (Next.js 16's middleware successor) reads the signed JWT from cookies with `getToken()` and checks `role`.

Use `getToken()` in proxy — **not** `getServerSession()` or `getCurrentUser()`.

## Files
- `proxy.ts`
- `app/(admin)/not-authorized/page.tsx`
- `app/(admin)/dashboard/layout.tsx`

## Proxy Rules
```txt
public host + /dashboard
  -> redirect to /

admin host + /
  -> redirect to /dashboard

admin host + unknown public path (not /login, /not-authorized)
  -> redirect to /dashboard

admin route + no JWT
  -> redirect to /login?callbackUrl=/dashboard

admin route + JWT role !== ADMIN
  -> redirect to /not-authorized

admin route + ADMIN
  -> allow
```

`isAllowedAdminPublicPath` allows only `/login` and `/not-authorized` on admin hosts — **not** `/signup`.

## Dashboard Layout (Defense in Depth)
```ts
const currentUser = await getCurrentUser();
if (!currentUser) redirect("/login?callbackUrl=/dashboard");
if (currentUser.role !== "ADMIN") redirect("/not-authorized");
```

## Testing Admin Access
No seed script yet. Manually set one user's `role` to `ADMIN` in MongoDB, then **log out and log back in** so the JWT picks up the new role.

## Implementation steps
1. Implement host helpers in `proxy.ts`:

```ts
const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
const PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"];
```

2. **Case 1** — public host + `/dashboard` → redirect `/`.
3. **Case 2** — admin host + `/` → redirect `/dashboard`.
4. **Case 3** — admin host + non-dashboard path (except `/login`, `/not-authorized`) → redirect `/dashboard`.
5. **Case 4** — admin or dashboard route: use `getToken({ req, secret: process.env.NEXTAUTH_SECRET })` (not `getServerSession`):

```ts
if (!token) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", "/dashboard");
  return NextResponse.redirect(loginUrl);
}
if (token.role !== "ADMIN") {
  return NextResponse.redirect(new URL("/not-authorized", request.url));
}
```

6. Create `app/(admin)/not-authorized/page.tsx`.
7. Repeat check in `app/(admin)/dashboard/layout.tsx` (defense in depth) — see Dashboard Layout section above.
8. Test: change role in MongoDB → **log out and back in** so JWT picks up new role.

## Key points
> Proxy is the bouncer. Layout is the second locked door.

> Changing role in MongoDB does not update the cookie until re-login.

## End State
Admin surface is protected at the edge and again in the dashboard layout.

## Next
[Lecture 106 — Clean Layout for Auth Pages](./lecture-106-clean-auth-layout.md) introduces a dedicated auth layout under `app/(auth)/`.
