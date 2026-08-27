# Lecture 099 - Login Flow and Sessions | تسجيل الدخول والجلسات

## Goal
Complete credentials login: `verifyCredentials`, `authorize`, JWT and session callbacks, module augmentation for `id` and `role`, and client login with `signIn(..., { redirect: false })`.

## Background
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

## Implementation steps
1. Implement `verifyCredentials(email, password)` in `services/auth/auth.service.ts`:

```ts
const user = await findUserByEmailWithPassword(email);
if (!user || !(await verifyPassword(password, user.passwordHash))) return null;
return { id: user.id, email: user.email, name: user.name, role: user.role };
```

2. Wire `authorize` in `lib/auth.ts` to delegate to `verifyCredentials` (4-line delegate — no bcrypt in config).
3. Add JWT callback (write `id` + `role` when `user` present) and session callback (copy to `session.user`).
4. Create `types/next-auth.d.ts` augmenting `Session`, `User`, `JWT` with `id` and `role` via `extends DefaultUser` / `extends DefaultJWT`.
5. Build `components/auth/LoginForm.tsx` — `signIn("credentials", { ..., redirect: false })`, inline errors, `router.push` + `router.refresh()` on success.
6. Create `app/(auth)/login/page.tsx` with `LoginForm` and `callbackUrl` from search params.

## Key points
> Return `null` from authorize for bad credentials — do not throw for normal login failures.

> After login, call `router.refresh()` so server components see the new cookie.

## End State
Users can log in and receive a JWT session with `id` and `role`.

## Next
[Lecture 100 — Signup Redirect on Success](./lecture-100-signup-redirect-cleanup.md) cleans up signup so success means immediate entry into the app.
