# Lecture 106 - Clean Layout for Auth Pages | صفحات بسيطة لتسجيل الدخول وإنشاء حساب

## Status: **Implemented**

Auth pages no longer render inside the public client layout with navbar and footer. They live in the `(auth)` route group with a dedicated layout while URLs stay `/login` and `/signup`.

## Goal

Give login and signup a focused, distraction-free layout on the public host, and a centered minimal form on the admin host — without duplicating route URLs.

## Explain It Simply (For Beginners)

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

## Recording Steps

1. Move `login` and `signup` pages from `(client)` to `(auth)`.
2. Create `app/(auth)/layout.tsx` with host detection.
3. Confirm public `/login` shows branding split; admin host shows centered card.
4. Visit `admin.wazifa.app/signup` — show redirect to dashboard.
5. Confirm `lib/auth.ts` still sets `pages.signIn = "/login"` (unchanged URL).

## Key Teaching Lines

> Route groups change layout, not the URL.

> Admin gets login, not signup. Proxy enforces that policy.

## End State

Auth pages have a clean, host-appropriate layout. URLs remain `/login` and `/signup`.

## Next

Lecture 107 discusses RBAC — currently ad-hoc role checks only.
