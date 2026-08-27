# Lecture 106 - Clean Layout for Auth Pages | صفحات بسيطة لتسجيل الدخول وإنشاء حساب

## Status: **Implemented**
Auth pages no longer render inside the public client layout with navbar and footer. They live in the `(auth)` route group with a dedicated layout while URLs stay `/login` and `/signup`.

## Goal
Give login and signup a focused, distraction-free layout on the public host, and a centered minimal form on the admin host — without duplicating route URLs.

## Background
Logging in is a different mode than browsing jobs. The full marketing navbar/footer adds noise and leaks public branding into admin login.

The `(auth)` route group solves this: same URLs, different layout wrapper.

## Files (Verified)
- `app/(auth)/layout.tsx` — host-aware auth shell
- `app/(auth)/login/page.tsx` — server page, `getCurrentUser()` guard, `LoginForm`
- `app/(auth)/signup/page.tsx` — server page, `getCurrentUser()` guard, `SignupForm`

> Auth pages are **not** under `app/(client)/login` or `app/(client)/signup`.

## Public Host Layout
Two-column grid on large screens:

- Left: Wazifa branding panel (`FIND THE RIGHT ROLE. FAST.`)
- Right: centered form (`{children}`)

## Admin Host Layout
Detected via `headers().get("host")` against `ADMIN_HOSTS`:

```ts
["admin.wazifa.app", "dev-admin.wazifa.app"]
```

Renders a **centered form only** — no signup marketing panel, no public navbar.

## No Signup on Admin Host
`proxy.ts` `isAllowedAdminPublicPath` allows only:

- `/login`
- `/not-authorized`

A request to `admin.wazifa.app/signup` hits Case 3 and redirects to `/dashboard`. Admin users authenticate; candidates sign up on the public site.

## Implementation steps
1. Move `login` and `signup` from `(client)` to `app/(auth)/` — URLs stay `/login` and `/signup`.
2. Create `app/(auth)/layout.tsx` with host detection via `headers().get("host")`:

```ts
const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
export const dynamic = "force-dynamic";
export const revalidate = 0;
```

3. **Public host layout** — two-column grid: branding panel left, centered `{children}` right.
4. **Admin host layout** — centered form only, no marketing panel:

```tsx
if (isAdminHost) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      {children}
    </div>
  );
}
```

5. Keep `lib/auth.ts` `pages.signIn = "/login"` unchanged.
6. Confirm `proxy.ts` blocks `/signup` on admin host (Case 3 redirect to `/dashboard`).

## Key points
> Route groups change layout, not the URL.

> Admin gets login, not signup. Proxy enforces that policy.

## End State
Auth pages have a clean, host-appropriate layout. URLs remain `/login` and `/signup`.

## Next
[Lecture 107 — Feature Branch for Day (10)](./lecture-107-feature-branch-day-10.md) ships authentication work through the branch workflow.
