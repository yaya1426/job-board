# Lecture 090 - Applications: Using Aggregates for Queries | الاستعلامات التجميعية

## Goal
Compute `applicants` count per job at query time using `$lookup` and `$size`, keeping job documents free of denormalized counters.

## Background
The jobs list shows how many people applied. Two ways to get that number:

1. **Store** `applicants: 7` on the job document and increment it on every apply — fast reads, easy to get wrong.
2. **Compute** it when reading jobs — count matching applications each time.

Day 9 chooses option 2 with an **aggregation pipeline**:

```txt
jobs collection
  -> $lookup applications where application.jobId == job._id
  -> $addFields applicants: { $size: "$applications" }
  -> $project hide the applications array
```

If someone deletes an application or data is fixed manually, the count stays correct automatically.

## Files
- `repositories/jobs.repository.ts` — `findAllJobs`, `findJobById`

## Pipeline Sketch
```js
JobModel.aggregate([
  {
    $lookup: {
      from: "applications",
      localField: "_id",
      foreignField: "jobId",
      as: "applications",
    },
  },
  {
    $addFields: {
      applicants: { $size: "$applications" },
    },
  },
  {
    $project: {
      applications: 0,
    },
  },
]);
```

`findJobById` adds `$match: { _id: new ObjectId(id) }` at the start.

## Implementation steps
1. Update `findAllJobs` in `repositories/jobs.repository.ts` to use aggregation:

```js
JobModel.aggregate([
  { $lookup: { from: "applications", localField: "_id", foreignField: "jobId", as: "applications" } },
  { $addFields: { applicants: { $size: "$applications" } } },
  { $project: { applications: 0 } },
]);
```

2. Update `findJobById` with the same pipeline prefixed by `$match: { _id: new ObjectId(id) }`.
3. Import `ObjectId` from `mongodb` (not mongoose) for the match stage.
4. Map each result through existing `toJob` — `posted` Date → string conversion still applies.
5. Confirm job cards and detail pages show live counts after apply/delete in Atlas.
6. Do **not** store `applicants` on the job document.

## Key points
> Derived data beats duplicated data when correctness matters more than micro-optimizing reads.

> Aggregation lives in the repository because it is a database read strategy.

## End State
Job cards and detail pages show accurate applicant counts without write-time counter maintenance.

## Next
Lecture 091 follows the project's feature-branch workflow for Day 9.
