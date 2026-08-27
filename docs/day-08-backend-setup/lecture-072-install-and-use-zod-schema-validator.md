# Lecture 72 - Install & Use Zod Schema Validator

## Goal
Add zod for runtime validation beside services: define `createJobSchema`, infer `CreateJobInput`, return field errors from `safeParse`.

## Implementation Status
**Complete.** Zod v4 used with `z.flattenError` for field errors across jobs, applications, auth, uploads, screening.

## Key Files
- `services/jobs/jobs.validation.ts`
- `services/applications/applications.validation.ts`
- `package.json` — `"zod": "^4.3.6"`

## What Was Built
```ts
export const createJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  // ...
  tags: z.array(z.string()).min(1, "Tags are required"),
  requirements: z.array(z.string().min(1, "Requirements are required")),
});
export type CreateJobInput = z.infer<typeof createJobSchema>;
```

Service pattern:

```ts
const validated = createJobSchema.safeParse(input);
if (!validated.success) {
  return { success: false, errors: z.flattenError(validated.error).fieldErrors };
}
```

## Implementation steps
### Step 1

Install zod (already in `package.json` as `"zod": "^4.3.6"`):

```bash
npm install zod
```

### Step 2

Create `services/jobs/jobs.validation.ts` beside `jobs.service.ts`:

```ts
export const createJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  // ... location, type, salary, tags array, description, requirements array
});
export type CreateJobInput = z.infer<typeof createJobSchema>;
```

### Step 3

In `createJob`, use `safeParse` — never throw to the client:

```ts
const validated = createJobSchema.safeParse(input);
if (!validated.success) {
  return { success: false, errors: z.flattenError(validated.error).fieldErrors };
}
```

### Step 4

Ensure every `.min(1, "...")` message is a non-empty human string — empty messages surface as `undefined` in form errors.

### Step 5

Document transform order: action splits comma/newline strings → arrays → service validates arrays with zod.

### Verify

- `createJobSchema` in `services/jobs/jobs.validation.ts`.
- `createJob` uses `safeParse` + `z.flattenError` (zod v4 API).
- Submitting empty required fields returns field-level errors to the form.

### End State

Job creation is runtime-validated beside the service. Same pattern extends to `applications.validation.ts` and auth validation on later days.

## Verify
- `createJobSchema` in `services/jobs/jobs.validation.ts`.
- `createJob` uses `safeParse` + `z.flattenError`.
- All validation messages are non-empty strings.

## Notes/Gaps
- Zod v4 `flattenError` API — confirm vs v3 `flatten()` when students use older tutorials.
- Action layer transforms strings to arrays before validation — document order of operations.

## Next
Lecture 073 — `useActionState` for form error display.
