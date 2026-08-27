# Lecture 103 - Showing Auth State in the Navbar | حالة المصادقة في الشريط

## Goal
Make the navbar reflect session state: guest links vs signed-in name and sign-out, with server rendering for account area and small client islands only where browser APIs are required.

## Background
Before this lecture, everyone saw the same header — logged in or not. That feels broken once auth exists.

Split responsibilities:

```txt
NavbarHeader (server) — layout shell
  NavbarLinks (client) — usePathname() for active underline
  NavbarAccount (server) — getCurrentUser()
    SignOutButton (client) — signOut() on click
```

Guests see **LOGIN** and **SIGN UP**. Signed-in users see their name and sign out.

## Files
- `components/navbar/NavbarHeader.tsx`
- `components/navbar/NavbarLinks.tsx`
- `components/navbar/NavbarAccount.tsx`
- `components/navbar/SignOutButton.tsx`

## Why Each Piece's Layer
| Component | Server/Client | Reason |
|-----------|---------------|--------|
| `NavbarHeader` | Server | Static shell |
| `NavbarLinks` | Client | `usePathname()` |
| `NavbarAccount` | Server | `getCurrentUser()` for correct initial HTML |
| `SignOutButton` | Client | `signOut()` from `next-auth/react` |

Use `pathname.startsWith("/jobs")` so `/jobs/[id]` keeps Jobs active.

## Implementation steps
1. Keep `NavbarHeader.tsx` as server component (layout shell).
2. Extract `NavbarLinks.tsx` as client component — `usePathname()` for active underline; use `pathname.startsWith("/jobs")`.
3. Create `NavbarAccount.tsx` server component — `await getCurrentUser()` for guest vs signed-in branches.
4. Create `SignOutButton.tsx` client component — `signOut()` on click.
5. Guests: LOGIN + SIGN UP links. Signed-in: name + sign out.
6. Remember: navbar visibility is UX only — security lives in services, actions, and proxy.

## Key points
> Hide links in the UI if you want. Protect data in the service, action, and proxy.

> If navbar still shows LOG IN after login, you forgot `router.refresh()`.

## End State
Navbar honestly reflects auth state on first paint and after navigation.

## Next
[Lecture 104 — Protecting Server Actions](./lecture-104-protect-server-actions-ux.md) protects Server Actions and improves guest apply UX.
