# Lecture 101 - Getting Current Logged User | المستخدم الحالي

## Goal
Add `lib/current-user.ts` and `hooks/useCurrentUser.ts`, redirect signed-in users away from auth pages, and replace the temporary `candidateId` in `applyToJob` with `getCurrentUser().id`.

## Background
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

## Implementation steps
1. Create `lib/current-user.ts`:

```ts
export async function getCurrentUser(): Promise<User | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email || !session.user.name) return null;
  return { id: session.user.id, email: session.user.email, name: session.user.name, role: session.user.role };
}
```

2. Create `hooks/useCurrentUser.ts` wrapping `useSession()` — same `User | null` shape for client UI only.
3. Guard `app/(auth)/login/page.tsx` and `app/(auth)/signup/page.tsx` — redirect signed-in users to `/`.
4. Update `applyToJob` — replace Day 9 mock `candidateId` with `getCurrentUser().id`; return `errors.auth` if no user.
5. Never trust `candidateId` from form body; session owns identity.
6. In `proxy.ts`, use `getToken()` — not `getCurrentUser()`.

## Key points
> Client session is for display. Server session is for security.

> Day 9's fake candidate id is gone. Applications now belong to real users.

## End State
Server code has one identity helper; applications bind to authenticated users.

## Next
[Lecture 102 — Adding User Profile](./lecture-102-user-profile.md) splits profile data into `UserProfile`.
