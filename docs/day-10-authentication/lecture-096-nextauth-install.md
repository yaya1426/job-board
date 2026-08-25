# Lecture 096 - Installing and Configuring NextAuth.js | تثبيت NextAuth

## Goal

Install NextAuth.js v4, mount the catch-all API route, wrap the app in `SessionProvider`, and create a configuration-only `lib/auth.ts` with JWT sessions and a custom sign-in page.

## Explain It Simply (For Beginners)

**Authentication** answers: "Who is this person?"

NextAuth.js is the library we use to:

- Accept login credentials
- Issue a signed session cookie
- Let server and client code read the current user safely

We use **v4** (stable on Next.js 16), not v5/Auth.js beta.

Sessions use **JWT strategy** — the session lives in a signed cookie, not a database sessions table.

## Files

- `package.json` — `next-auth`, `bcryptjs`
- `app/api/auth/[...nextauth]/route.ts`
- `lib/auth.ts`
- `components/providers/SessionProvider.tsx`
- `app/layout.tsx`
- `.env.local` — `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

## Setup Steps

1. Install: `npm install next-auth bcryptjs` (+ types if needed).
2. Generate secret: `openssl rand -base64 32` → `NEXTAUTH_SECRET`.
3. Set `NEXTAUTH_URL=http://localhost:3000` for local dev.
4. Create `authOptions` in `lib/auth.ts`:
   - `session.strategy = "jwt"`
   - `pages.signIn = "/login"`
   - `CredentialsProvider` stub (authorize filled in Lecture 099)
5. Export GET/POST handler from `app/api/auth/[...nextauth]/route.ts`.
6. Wrap `{children}` in `<SessionProvider>` at root layout.

## Configuration-Only Rule

`lib/auth.ts` must not import repositories or `bcryptjs`. The `authorize` callback will delegate to `verifyCredentials` in the auth service (Lecture 099).

```txt
lib/auth.ts (config)
  -> services/auth/auth.service.ts
  -> repositories/users.repository.ts
```

## Recording Steps

1. Explain why JWT sessions fit this course (no session collection, fewer moving parts).
2. Install packages and env vars.
3. Create route handler and SessionProvider.
4. Hit `/api/auth/signin` or `/login` to confirm NextAuth mounts without 500s.
5. Leave `authorize` as a stub returning `null` until user model exists.

## Key Teaching Lines

> `lib/auth.ts` is wiring, not business logic.

> No `NEXTAUTH_SECRET` means no production sessions — even with JWT.

## End State

NextAuth is installed and mounted. Login behavior comes after the user model and password hashing.

## Next

Lecture 097 adds `UserModel` and role constants.
