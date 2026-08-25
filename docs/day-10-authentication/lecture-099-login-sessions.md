# Lecture 099 - Login Flow and Sessions | تسجيل الدخول والجلسات

## Goal

Complete credentials login: `verifyCredentials`, `authorize`, JWT and session callbacks, module augmentation for `id` and `role`, and client login with `signIn(..., { redirect: false })`.

## Explain It Simply (For Beginners)

Login is a chain of three callbacks:

1. **`authorize`** — "Are these credentials valid?" Returns a user object or `null`.
2. **`jwt`** — "What goes in the signed token?" On first sign-in, copy `id` and `role` onto the token.
3. **`session`** — "What does the app read?" Copy `id` and `role` from token onto `session.user`.

Teaching line:

> `authorize` says who you are. `jwt` decides what gets stored in the cookie. `session` decides what the app sees.

## Files

- `services/auth/auth.service.ts` — `verifyCredentials`
- `lib/auth.ts` — provider + callbacks
- `types/next-auth.d.ts` — augment `Session`, `User`, `JWT`
- `components/auth/LoginForm.tsx`
- `app/(auth)/login/page.tsx`

## `verifyCredentials`

```txt
findUserByEmailWithPassword(email)
  -> verifyPassword(plain, hash)
  -> return User | null (no passwordHash)
```

## Client Login

```ts
const result = await signIn("credentials", {
  email,
  password,
  redirect: false,
});
```

`redirect: false` is required for inline errors instead of NextAuth's default error page.

On success: `router.push(callbackUrl ?? "/")` + `router.refresh()`.

## Type Augmentation

Extend with `extends DefaultUser` / `extends DefaultJWT`:

- `session.user.id`
- `session.user.role`
- `token.id`, `token.role`

Without this file, `user.role` red-squiggles in `lib/auth.ts`.

## Recording Steps

1. Implement `verifyCredentials` and wire `authorize`.
2. Add jwt/session callbacks.
3. Create `types/next-auth.d.ts`; restart TS server if needed.
4. Build `LoginForm` with inline error state.
5. Log in; inspect `next-auth.session-token` cookie in DevTools.
6. Show `useSession()` on client vs `getServerSession` preview for Lecture 101.

## Key Teaching Lines

> Return `null` from authorize for bad credentials — do not throw for normal login failures.

> After login, call `router.refresh()` so server components see the new cookie.

## End State

Users can log in and receive a JWT session with `id` and `role`.

## Next

Lecture 100 cleans up signup so success means immediate entry into the app.
