# Lecture 097 - Creating User Model and Roles | نموذج المستخدم والأدوار

## Goal
Add identity-only `UserModel`, `types/User.ts`, `types/Roles.ts`, and `users.repository.ts` with safe vs auth-only email lookups.

## Background
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

## Implementation steps
1. Create `types/Roles.ts`: `export const ROLES = ["CANDIDATE", "ADMIN"] as const`.
2. Create `types/User.ts` with `id`, `email`, `name`, `role` — **no** `passwordHash`.
3. Create `lib/models/user.model.ts` with `email` (unique, lowercased), `passwordHash`, `name`, `role` default `CANDIDATE`.
4. Create `repositories/users.repository.ts`:
   - `findUserByEmail(email)` → `User | null` (safe — no hash)
   - `findUserByEmailWithPassword(email)` → `(User & { passwordHash }) | null` (auth-only)
   - `saveNewUser(data)` → `User`
5. Implement `toUser` mapper: `_id` → `id`, strip `__v`, never return `passwordHash` from safe paths.

## Key points
> Identity and profile are separate concerns. Auth data is not product data.

> If `passwordHash` appears in a React prop, something went very wrong.

## End State
Users can be persisted and loaded by email with correct typing and mapping.

## Next
[Lecture 098 — Signup and Password Hashing](./lecture-098-signup-bcrypt.md) implements signup with bcrypt password hashing.
