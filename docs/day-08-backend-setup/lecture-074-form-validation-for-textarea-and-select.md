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

## Implementation steps
### Step 1

Review `components/ui/input.tsx` — `error?: string` prop adds `border-red-500` and renders `<p className="text-red-500 text-sm">`.

### Step 2

Add matching `error` API to `components/ui/textarea.tsx` — same border + message pattern.

### Step 3

Update `BrutalSelect` in `components/BrutalUI.tsx` to accept `error?: string` and display below the native `<select>`.

### Step 4

In `CreateJobForm`, wire errors to all field types:

```tsx
<TextArea name="description" error={state?.errors?.description?.[0]} />
<BrutalSelect name="type" error={state?.errors?.type?.[0]} ... />
<TextArea name="requirements" error={state?.errors?.requirements?.[0]} />
```

### Step 5

Trigger validation: submit with empty description, empty type (placeholder `value=""`), and empty requirements. Confirm inline errors without losing other field values.

### Verify

- `TextArea` and `BrutalSelect` accept `error` prop.
- `createJobSchema` requires `description`, `type`, and `requirements` array with `min(1)`.
- Select placeholder fails `min(1)` — forces explicit type choice.

### End State

All create-job field types participate in zod validation UX. `EditJobForm` remains controlled and non-persisting — separate from this pattern.

## Verify
- `TextArea` accepts `error?: string` and applies `border-red-500`.
- `CreateJobForm` passes errors to description, requirements, type fields.
- `createJobSchema` requires `description`, `type`, `requirements` array min length.

## Notes/Gaps
- Uncontrolled inputs preserve values on validation failure; controlled edit form is separate (still non-persisting).
- Select placeholder `value=""` fails `min(1)` — intentional forced choice.

## Next
Lecture 075 — feature branch for Day 8 work.
