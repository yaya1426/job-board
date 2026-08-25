# Lecture 105 - Protecting Admin Pages with Proxy | حماية صفحات الأدمن باستخدام البروكسي

## Goal

Block unauthenticated and non-admin users from admin dashboard routes using `getToken()` in `proxy.ts`, with dashboard layout defense in depth and a friendly `/not-authorized` page.

## Explain It Simply (For Beginners)

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

## Recording Steps

1. Explain host-based routing from Day 4.
2. Implement proxy cases with comments (Cases 1–5 in `proxy.ts`).
3. Add `not-authorized` page.
4. Repeat check in dashboard layout.
5. Demo candidate JWT blocked from `admin.wazifa.app/dashboard`.
6. Demo role change + re-login requirement.

## Key Teaching Lines

> Proxy is the bouncer. Layout is the second locked door.

> Changing role in MongoDB does not update the cookie until re-login.

## End State

Admin surface is protected at the edge and again in the dashboard layout.

## Next

Lecture 106 introduces a dedicated auth layout under `app/(auth)/`.
