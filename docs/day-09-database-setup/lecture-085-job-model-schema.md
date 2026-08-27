# Lecture 085 - Job Model & Schema | نموذج الوظيفة

## Goal
Create the Mongoose `Job` schema and `JobModel`, following the `mongoose.models.X || mongoose.model("X", schema)` guard to survive Next.js hot reload.

## Background
A **model** is Mongoose's typed handle for one collection. The **schema** declares what fields a job document must have.

For wazifa.app, a job includes hiring metadata the UI already displays: title, company, location, type, salary, tags, posted date, description, and requirements.

We do **not** store `applicants` on the job document. That count is derived later with aggregation (Lecture 090).

## Files
- `lib/models/job.model.ts`
- `types/Job.ts` (domain type used by services and UI)

## Schema Fields
| Field | Type | Notes |
|-------|------|-------|
| `title` | String | Required |
| `company` | String | Required |
| `location` | String | Required |
| `type` | String | Required (e.g. full-time) |
| `salary` | String | Required (display string) |
| `tags` | `[String]` | Required array |
| `posted` | Date | Defaults to `Date.now` |
| `description` | String | Required |
| `requirements` | `[String]` | Required array |

## Model Export Pattern
```ts
export const JobModel =
  mongoose.models.Job || mongoose.model("Job", jobSchema);
```

Without the guard, dev hot reload throws `OverwriteModelError` when the module re-evaluates.

## Implementation steps
1. Create `types/Job.ts` with `id: string` (domain shape — no `_id`).
2. Create `lib/models/job.model.ts`:

```ts
const jobSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  salary: { type: String, required: true },
  tags: { type: [String], required: true },
  posted: { type: Date, default: Date.now },
  description: { type: String, required: true },
  requirements: { type: [String], required: true },
});
export const JobModel = mongoose.models.Job || mongoose.model("Job", jobSchema);
```

3. Do **not** add `applicants` to the schema — that count is computed in Lecture 090.
4. Keep Mongoose models out of services; repositories import `JobModel` after `dbConnect()`.

## Key points
> The schema protects the database. The TypeScript type protects the app.

> Applicant count is computed, not copied. If we stored it on the job, it would drift out of sync.

## End State
`JobModel` exists and matches the job board UI fields. No repository or service wiring yet.

## Next
Lecture 086 introduces the repository layer and the first job queries.
