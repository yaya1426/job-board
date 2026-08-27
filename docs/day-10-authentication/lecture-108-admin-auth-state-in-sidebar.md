# Lecture 108 - Admin Auth State in Sidebar

## Status: **Implemented**

## Goal
Show the signed-in admin's identity in the dashboard sidebar and wire sign-out — passing `currentUser` from the server layout into a client sidebar component.

## Background
Day 5 introduced `AdminSidebar` as navigation only. After authentication (Lectures 096–106), the admin shell should reflect **who** is logged in and offer a clear exit path without duplicating the public navbar.

The pattern mirrors Lecture 103 on the public site: keep the shell server-owned, isolate client-only browser APIs to small leaf components.

## Files (Verified)
- `app/(admin)/dashboard/layout.tsx` — calls `getCurrentUser()`, enforces `role === "ADMIN"`, passes `currentUser` to sidebar
- `components/navbar/AdminSidebar.tsx` — client component; receives `currentUser: User`, renders name + sign out

## Server layout boundary
```tsx
const currentUser = await getCurrentUser();

if (!currentUser) {
  redirect("/login?callbackUrl=/dashboard");
}

if (currentUser.role !== "ADMIN") {
  redirect("/not-authorized");
}

return (
  <div className="min-h-screen bg-background flex">
    <AdminSidebar currentUser={currentUser} />
    <main className="flex-1 p-8 overflow-auto">{children}</main>
  </div>
);
```

The layout is defense in depth after `proxy.ts` (Lecture 105). Even if proxy rules change, the dashboard still refuses non-admins.

## AdminSidebar auth UI
- Footer shows `currentUser.name` from the server-passed prop.
- `SIGN OUT` button calls `signOut({ callbackUrl: "/login" })` from `next-auth/react`.
- Sidebar stays client-side because it uses `usePathname()` for active links and `signOut()` for the click handler.

## Implementation steps
1. Update `AdminSidebar` props to require `currentUser: User`.
2. In `dashboard/layout.tsx`, call `getCurrentUser()` before rendering children.
3. Redirect guests to `/login?callbackUrl=/dashboard` and non-admins to `/not-authorized`.
4. Pass `currentUser` into `<AdminSidebar currentUser={currentUser} />`.
5. Add footer block with name + sign-out button; use `callbackUrl: "/login"` so admin host returns to admin login.
6. Verify on `dev-admin.wazifa.app`: login as admin, see name in sidebar, sign out returns to login.

## Key points
> The sidebar displays auth state; it does not grant auth state. The layout and proxy already decided access.

> Pass serializable `User` props from server to client — never pass secrets or `passwordHash`.

## Verify
- Signed-in admin sees their name above `SIGN OUT` in the sidebar.
- Sign out clears the session and lands on `/login` on the admin host.
- Candidate JWT still cannot reach dashboard pages (proxy + layout).

## Next
[Lecture 109 — Recap Day (10)](./lecture-109-recap-day-10.md) verifies the full authentication milestone end-to-end.
