# Lecture 101 - Getting Current Logged User | المستخدم الحالي

## Goal

Add `lib/current-user.ts` and `hooks/useCurrentUser.ts`, redirect signed-in users away from auth pages, and replace the temporary `candidateId` in `applyToJob` with `getCurrentUser().id`.

## Explain It Simply (For Beginners)

The session cookie exists, but server code should not scatter `getServerSession` calls everywhere.

`getCurrentUser()` is the server helper that returns the app's `User | null` shape:

```ts
{ id, name, email, role }
```

`useCurrentUser()` mirrors that on the client for UI convenience only. **Security decisions use `getCurrentUser()` on the server.**

## Files

- `lib/current-user.ts`
- `hooks/useCurrentUser.ts`
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `services/applications/applications.service.ts`

## Server vs Client

| Context | Use |
|---------|-----|
| Server Actions, services, server pages | `await getCurrentUser()` |
| Client-only UI (optional) | `useCurrentUser()` |
| `proxy.ts` | `getToken()` — not `getCurrentUser()` |

## Apply Ownership

```ts
const currentUser = await getCurrentUser();
if (!currentUser) {
  return { success: false, errors: { auth: ["You must be logged in to apply"] } };
}
// candidateId: currentUser.id
```

Never trust `candidateId` from the form body.

## Auth Page Guards

Login and signup pages call `getCurrentUser()` and `redirect("/")` if already signed in.

## Recording Steps

1. Implement `getCurrentUser` mapping from NextAuth session.
2. Add client hook wrapping `useSession()`.
3. Guard `/login` and `/signup`.
4. Update `applyToJob` to require auth and set real `candidateId`.
5. Demonstrate guest apply failure at the service layer even if UI is wrong.

## Key Teaching Lines

> Client session is for display. Server session is for security.

> Day 9's fake candidate id is gone. Applications now belong to real users.

## End State

Server code has one identity helper; applications bind to authenticated users.

## Next

Lecture 102 splits profile data into `UserProfile`.
