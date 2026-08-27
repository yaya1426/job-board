# Lecture 086 - Repository Layer to Avoid Abstraction Leak | طبقة المستودع

## Goal
Introduce `repositories/jobs.repository.ts` as the only layer that touches Mongoose, with a `toJob` mapper that returns plain serializable domain objects.

## Background
The first instinct is to call `JobModel.find()` inside a service. That works once, then hurts:

- Mongoose returns `_id`, `__v`, and `Date` objects
- React client components choke on non-plain objects
- Services start knowing MongoDB details

The **repository** is the clerk between MongoDB and the rest of the app. It speaks Mongoose on one side and clean `Job` objects on the other.

## Why Not Skip It?
This layer is introduced **after pain**, not before theory:

1. Put Mongoose in a service → everything "works" in a server component
2. Pass data to a client component → Next.js error about plain objects
3. Fix mapping ad hoc → duplication across functions
4. Extract `toJob()` and `jobs.repository.ts` → one place owns DB concerns

## Files
- `repositories/jobs.repository.ts`
- `services/jobs/jobs.service.ts` (updated to call repository instead of mocks)

## Mapper Responsibilities
`toJob(doc)` must:

- Convert `_id` → `id: string`
- Drop `__v`
- Convert `posted: Date` → ISO date string (or `YYYY-MM-DD` slice)
- Return a plain object matching `types/Job.ts`

## Initial Repository Functions
| Function | Purpose |
|----------|---------|
| `saveNewJob(input)` | `JobModel.create` after `dbConnect()` |
| `findAllJobs()` | List jobs (aggregation added in Lecture 090) |
| `findJobById(id)` | Single job lookup |

## Implementation steps
1. Create `repositories/jobs.repository.ts` with a private `JobLean` type and `toJob` mapper:

```ts
function toJob(doc: JobLean): Job {
  const { _id, __v, posted, ...rest } = doc;
  return {
    id: _id.toString(),
    posted: posted instanceof Date
      ? posted.toISOString().split("T")[0]
      : String(posted),
    ...rest,
  };
}
```

2. Start every exported function with `await dbConnect()`.
3. Implement `saveNewJob`, `findAllJobs`, and `findJobById` (plain `find` first; aggregation comes in Lecture 090).
4. Update `services/jobs/jobs.service.ts` to import only from the repository — remove mock data reads.
5. Verify the public jobs page still renders after the swap.

## Architecture Diagram
```txt
CreateJobForm (client)
  -> handleCreateJob (action)
  -> createJob (service)
  -> saveNewJob (repository)
  -> JobModel
  -> MongoDB
```

## Key points
> Repositories are not ceremony. They are where database weirdness stops.

> If you see `_id` outside `repositories/`, something leaked.

## End State
Jobs are read and written through the repository. Services work with domain types only.

## Next
Lecture 087 adds the `Application` model and its repository.
