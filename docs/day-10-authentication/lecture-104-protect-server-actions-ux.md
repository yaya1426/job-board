# Lecture 104 - Protecting Server Actions & Enhance UX | حماية السيرفر أكشن وتحسين التجربة

## Goal

Protect sensitive mutations at the Server Action layer, replace the confusing guest apply state with `ApplyAuthPrompt`, and support `callbackUrl` on login/signup so users return to the job they were viewing.

## Explain It Simply (For Beginners)

Two problems:

1. **Security** — Guests could not apply anyway (service checks auth), but admins could hit create-job actions if we only hid the button.
2. **UX** — Logged-out visitors on a job page saw `USER PROFILE NOT FOUND`, which sounds like a bug. The real issue: they were not logged in.

Lecture 104 fixes both.

## Files

- `components/jobs/ApplyAuthPrompt.tsx`
- `app/(client)/jobs/[id]/page.tsx`
- `components/auth/LoginForm.tsx`
- `components/auth/SignupForm.tsx`
- `app/actions/jobs/jobs.action.ts`
- `components/job-management/CreateJobForm.tsx`
- `services/applications/applications.service.ts`

## Guest Apply UX

```txt
JobDetailsPage
  -> getCurrentUserProfile()
  -> if no user/profile for apply, show ApplyAuthPrompt
  -> else JobApplyForm
```

`ApplyAuthPrompt` links to:

- `/login?callbackUrl=/jobs/[id]`
- `/signup?callbackUrl=/jobs/[id]`

Forms accept `callbackUrl` and navigate there after success + `router.refresh()`.

## Server Action Protection

`handleCreateJob`:

```ts
const currentUser = await getCurrentUser();
if (!currentUser || currentUser.role !== "ADMIN") {
  return { errors: { auth: ["You are not allowed to create jobs"] } };
}
```

`applyToJob` already checks `getCurrentUser()` in the service — the page prompt guides users; the service enforces.

## Recording Steps

1. Show the bad guest experience before the prompt.
2. Build `ApplyAuthPrompt` with callback links.
3. Thread `callbackUrl` through auth pages and forms.
4. Add admin check to `handleCreateJob`; surface `errors.auth` in `CreateJobForm`.
5. Test: guest → prompt → login → return to job → prefilled apply form.

## Key Teaching Lines

> Friendly UI guides honest users. Server checks stop everyone else.

> Never rely on hiding a button as your only authorization.

## End State

Guests get clear CTAs; admin mutations and apply ownership are enforced server-side.

## Next

Lecture 105 protects admin routes in `proxy.ts`.
