# Lecture 104 - Protecting Server Actions | حماية السيرفر أكشن وتحسين التجربة

## Goal
Protect sensitive mutations at the Server Action layer, replace the confusing guest apply state with `ApplyAuthPrompt`, and support `callbackUrl` on login/signup so users return to the job they were viewing.

## Background
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

## Implementation steps
1. Create `components/jobs/ApplyAuthPrompt.tsx` — links to `/login?callbackUrl=/jobs/[id]` and `/signup?callbackUrl=/jobs/[id]`.
2. Update job details page — guests see `ApplyAuthPrompt` instead of confusing `USER PROFILE NOT FOUND`.
3. Thread `callbackUrl` through `LoginForm` and `SignupForm`; navigate there after auth + `router.refresh()`.
4. Protect `handleCreateJob` in `app/actions/jobs/jobs.action.ts`:

```ts
const currentUser = await getCurrentUser();
if (!currentUser || currentUser.role !== "ADMIN") {
  return { errors: { auth: ["You are not allowed to create jobs"] } };
}
```

5. Surface `errors.auth` in `CreateJobForm` with `isPending` on submit button.
6. `applyToJob` auth check stays in the **service** layer (`errors.auth`).

## Key points
> Friendly UI guides honest users. Server checks stop everyone else.

> Never rely on hiding a button as your only authorization.

## End State
Guests get clear CTAs; admin mutations and apply ownership are enforced server-side.

## Next
[Lecture 105 — Protecting Admin Pages with Proxy](./lecture-105-proxy-admin-protection.md) protects admin routes in `proxy.ts`.
