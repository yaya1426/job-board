# Lecture 73 - useActionState Hook for Handling Form State

## Goal
Connect Server Actions to client forms with React `useActionState`: pending state, returned field errors, and progressive form submission.

## Implementation Status
**Complete.** `CreateJobForm` and `JobApplyForm` use `useActionState`.

## Key Files
- `components/job-management/CreateJobForm.tsx`
- `components/jobs/JobApplyForm.tsx`
- `app/actions/jobs/jobs.action.ts` — `CreateJobState`
- `types/ServiceResult.ts`

## What Was Built
- `useActionState(handleCreateJob, undefined)` returns `[state, formAction, isPending]`.
- Field errors: `state?.errors?.title?.[0]` passed to `<Input error={…} />`.
- Submit button disabled or labeled while `isPending`.
- Action return shape `{ errors?: Record<string, string[]> }` mirrors failed `ServiceResult`.

## Implementation steps
### Step 1

In `components/job-management/CreateJobForm.tsx`, import `useActionState` from `react` (React 19 — replaced `useFormState` from `react-dom`).

### Step 2

Wire the hook:

```tsx
const [state, formAction, isPending] = useActionState<CreateJobState, FormData>(
  handleCreateJob,
  undefined,
);
```

### Step 3

Bind the form: `<form action={formAction} ...>`.

### Step 4

Pass field errors to shared inputs: `error={state?.errors?.title?.[0]}`. Open auth errors: `state?.errors?.auth?.[0]`.

### Step 5

Use `isPending` on submit button: `disabled={isPending}` and label `"PUBLISHING..."` while pending.

### Verify

- `CreateJobForm` uses `useActionState<CreateJobState, FormData>`.
- Submitting empty form shows inline zod errors without full page reload.
- `JobApplyForm` uses the same pattern with `handleApplyToJob`.
- Uncontrolled named inputs preserve values on validation failure.

### End State

Server Action errors flow back to the client form. Pattern A (`useActionState`) is the default for CRUD forms. Auth forms use Pattern B (plain client handler) — taught Day 10.

## Verify
- `CreateJobForm` uses `useActionState<CreateJobState, FormData>`.
- `Input` components receive `error={state?.errors?.field?.[0]}`.
- `isPending` used on submit button.

## Notes/Gaps
- React 19 `useActionState` replaced `useFormState` from `react-dom` — mention rename.
- Success navigation after create may use `useEffect` on state or separate redirect pattern.

## Next
Lecture 074 — textarea and select validation UX.
