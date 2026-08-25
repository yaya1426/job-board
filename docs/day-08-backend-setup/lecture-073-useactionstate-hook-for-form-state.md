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

## Recording Outline

1. Explain why auth forms use plain handlers instead (Pattern B) — preview Day 10.
2. Import `useActionState` from `react`.
3. Type state as `CreateJobState | undefined`.
4. Wire `action={formAction}` on `<form>`.
5. Submit empty form and show inline zod errors without page reload.

## Verify in Repo

- `CreateJobForm` uses `useActionState<CreateJobState, FormData>`.
- `Input` components receive `error={state?.errors?.field?.[0]}`.
- `isPending` used on submit button.

## Notes/Gaps

- React 19 `useActionState` replaced `useFormState` from `react-dom` — mention rename.
- Success navigation after create may use `useEffect` on state or separate redirect pattern.

## Next

Lecture 074 — textarea and select validation UX.
