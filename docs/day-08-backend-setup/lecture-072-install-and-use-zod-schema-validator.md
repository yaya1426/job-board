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

## Recording Outline

1. `npm install zod`.
2. Create `jobs.validation.ts` next to `jobs.service.ts`.
3. Write schema with human-readable `.min(1, "…")` messages.
4. Use `safeParse` in `createJob` — never throw to the client.
5. Show inferred TypeScript type from schema.

## Verify in Repo

- `createJobSchema` in `services/jobs/jobs.validation.ts`.
- `createJob` uses `safeParse` + `z.flattenError`.
- All validation messages are non-empty strings.

## Notes/Gaps

- Zod v4 `flattenError` API — confirm vs v3 `flatten()` when students use older tutorials.
- Action layer transforms strings to arrays before validation — document order of operations.

## Next

Lecture 073 — `useActionState` for form error display.
