# Lecture 74 - Form Validation for TextArea and Select

## Goal

Extend shared form components (`TextArea`, `BrutalSelect`) with error display so multi-line and dropdown fields participate in zod validation like `Input`.

## Implementation Status

**Complete.** `TextArea` and `BrutalSelect` accept `error` prop; create job form shows description/requirements/type errors.

## Key Files

- `components/ui/textarea.tsx`
- `components/ui/input.tsx`
- `components/BrutalUI.tsx` — `BrutalSelect`
- `components/job-management/CreateJobForm.tsx`

## What Was Built

- `TextArea` — `error` prop renders red border + message below.
- `BrutalSelect` — `error` prop for type field (`type` required in schema).
- Create form wires `error={state?.errors?.description?.[0]}` etc.
- Requirements textarea: newline-separated values parsed to string array in action.

## Recording Outline

1. Review `Input` error pattern from earlier UI day.
2. Add matching `error` API to `TextArea`.
3. Add `error` to `BrutalSelect` (native `<select>` under brutal styling).
4. Trigger validation: empty description, empty type, empty requirements line.
5. Show errors inline without losing other field values (uncontrolled named fields).

## Verify in Repo

- `TextArea` accepts `error?: string` and applies `border-red-500`.
- `CreateJobForm` passes errors to description, requirements, type fields.
- `createJobSchema` requires `description`, `type`, `requirements` array min length.

## Notes/Gaps

- Uncontrolled inputs preserve values on validation failure; controlled edit form is separate (still non-persisting).
- Select placeholder `value=""` fails `min(1)` — intentional forced choice.

## Next

Lecture 075 — feature branch for Day 8 work.
