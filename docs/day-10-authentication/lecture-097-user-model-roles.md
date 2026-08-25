# Lecture 097 - Creating User Model and Roles | نموذج المستخدم والأدوار

## Goal

Add identity-only `UserModel`, `types/User.ts`, `types/Roles.ts`, and `users.repository.ts` with safe vs auth-only email lookups.

## Explain It Simply (For Beginners)

A **user** in wazifa.app is identity for login — not the full candidate résumé.

Stored on `User`:

- `email` (unique, lowercased)
- `passwordHash` (never returned to UI)
- `name`
- `role` — `CANDIDATE` or `ADMIN`

Profile fields like LinkedIn and resume belong on **`UserProfile`** (Lecture 102), not on `User`.

## Files

- `lib/models/user.model.ts`
- `types/User.ts`
- `types/Roles.ts` — `export const ROLES = ["CANDIDATE", "ADMIN"] as const`
- `repositories/users.repository.ts`

## Repository Methods

| Method | Returns | Use |
|--------|---------|-----|
| `findUserByEmail(email)` | `User \| null` | General reads — **no** `passwordHash` |
| `findUserByEmailWithPassword(email)` | `(User & { passwordHash }) \| null` | Auth-only path |
| `saveNewUser(data)` | `User` | Signup |

Two lookup methods are intentional: never accidentally serialize `passwordHash` outside the auth path.

## Mapper

`toUser` converts `_id` → `id`, strips `__v`, and omits `passwordHash` from the public `User` type.

## Recording Steps

1. Define `ROLES` tuple and `Role` type.
2. Create user schema with `role` default `CANDIDATE`.
3. Implement repository with `dbConnect()` guard on every function.
4. Show why `passwordHash` is not on `types/User.ts`.
5. Manually insert a test user document (optional) before signup UI exists.

## Key Teaching Lines

> Identity and profile are separate concerns. Auth data is not product data.

> If `passwordHash` appears in a React prop, something went very wrong.

## End State

Users can be persisted and loaded by email with correct typing and mapping.

## Next

Lecture 098 implements signup with bcrypt password hashing.
