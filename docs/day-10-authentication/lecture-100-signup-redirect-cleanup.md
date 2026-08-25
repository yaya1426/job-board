# Lecture 100 - Signup Success Redirect Cleanup | تحسين إعادة التوجيه بعد التسجيل

## Goal

Fix the post-signup experience: after `handleSignup` succeeds, auto `signIn`, navigate to `callbackUrl` or `/`, and `router.refresh()` — so users never land back on signup wondering what happened.

## Explain It Simply (For Beginners)

Signup is two steps for the user but should feel like one:

1. Create account (Server Action)
2. Sign in (NextAuth client call)
3. Enter the app (client navigation)

`useActionState`'s `formAction` does not expose a promise, which makes this chaining awkward. Auth forms therefore use **Pattern B**: plain async client handler.

## Files

- `components/auth/SignupForm.tsx`
- `app/actions/auth/auth.action.ts`

## Client Handler Flow

```ts
async function onSubmit(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = await handleSignup(formData);
  if (result?.errors) { setErrors(result.errors); return; }

  const signInResult = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });
  if (!signInResult?.ok) { setErrors({ auth: ["Sign in failed"] }); return; }

  router.push(callbackUrl ?? "/");
  router.refresh();
}
```

## Action Contract

`handleSignup(formData)`:

- No `prevState` parameter (plain async function)
- Returns `{ errors }` on failure or `undefined` on success
- **No `redirect()` inside the action** — client orchestrates navigation

## Recording Steps

1. Show the old problem: signup succeeds but user stays on `/signup`.
2. Refactor `SignupForm` to Pattern B.
3. Re-read email/password once from `FormData` for the `signIn` call.
4. Test signup → lands on home with navbar showing signed-in state after refresh.
5. Test with `callbackUrl=/jobs/[id]` from apply prompt (wired fully in Lecture 104).

## Key Teaching Lines

> Success should mean "you are inside the app," not "now go log in again."

> Auth actions stay thin; the client owns the multi-step choreography.

## End State

Signup creates the user, establishes a session, and navigates in one smooth flow.

## Next

Lecture 101 introduces `getCurrentUser()` for server-side identity.
