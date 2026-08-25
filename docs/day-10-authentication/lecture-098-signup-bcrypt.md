# Lecture 098 - Signup and Password Hashing | التسجيل وتشفير كلمة المرور

## Goal

Implement secure signup: Zod validation, password confirmation, duplicate email check, bcrypt hashing via `lib/password.ts`, and persistence through the auth service and Server Action.

## Explain It Simply (For Beginners)

Storing plaintext passwords is unacceptable. If the database leaks, attackers read every password.

**bcrypt** transforms a password into a one-way hash. Login later hashes the attempt and compares — the plain password is never stored.

Flow:

```txt
SignupForm
  -> handleSignup (Server Action)
  -> signup (service)
  -> hashPassword
  -> saveNewUser (CANDIDATE)
```

## Files

- `lib/password.ts` — `hashPassword`, `verifyPassword`, `SALT_ROUNDS = 10`
- `services/auth/auth.validation.ts` — `signupSchema`
- `services/auth/auth.service.ts` — `signup()`
- `app/actions/auth/auth.action.ts` — `handleSignup(formData)`
- `components/auth/SignupForm.tsx`
- `app/(auth)/signup/page.tsx`

## Service Rules

- `safeParse` with flattened field errors
- Reject mismatched `password` / `confirmPassword`
- Reject duplicate email (generic error message on email field)
- Hash password before repository write
- Default role `CANDIDATE`

## Form Pattern B (Auth)

Signup uses a **plain client handler**, not `useActionState`, because signup will chain into `signIn` (Lecture 100).

## Recording Steps

1. Show why plaintext storage fails a security review.
2. Create `lib/password.ts` wrapper (services never import `bcryptjs` directly elsewhere).
3. Build `signupSchema` with human messages.
4. Implement `signup` service and `handleSignup` action.
5. Build `SignupForm` calling the action directly.
6. Verify new document in Atlas — `passwordHash` looks like bcrypt, not the raw password.

## Key Teaching Lines

> Hash at the service boundary. Verify at login. Never log passwords.

> Signup returns `ServiceResult<User>` — the shape `useActionState` expects when we use it elsewhere.

## End State

New candidates can register with hashed passwords. Auto-login after signup is Lecture 100.

## Next

Lecture 099 wires login through `CredentialsProvider` and JWT/session callbacks.
