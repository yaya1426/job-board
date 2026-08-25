# Day 9 - Database Setup

## Goal

Move the app from mock data to MongoDB using Mongoose, introduce the repository layer, and complete the end-to-end "apply to a job" flow with persisted applications.

## Complete Lecture Sequence

- [Lecture 081 - Day 9 Plan](./lecture-081-day-9-plan.md)
- [Lecture 082 - SQL vs NoSQL: What to Choose?](./lecture-082-sql-vs-nosql.md)
- [Lecture 083 - Setting Up MongoDB Atlas](./lecture-083-mongodb-atlas-setup.md)
- [Lecture 084 - Connection in Next.js using Mongoose](./lecture-084-mongoose-connection.md)
- [Lecture 085 - Job Model & Schema](./lecture-085-job-model-schema.md)
- [Lecture 086 - Repository Layer to Avoid Abstraction Leak](./lecture-086-repository-layer.md)
- [Lecture 087 - Applications: Model & Repository Logic](./lecture-087-applications-model-repository.md)
- [Lecture 088 - Applications: Create New Application Logic](./lecture-088-create-application.md)
- [Lecture 089 - Applications: Cleanup Test Data](./lecture-089-cleanup-test-data.md)
- [Lecture 090 - Applications: Using Aggregates for Queries](./lecture-090-aggregates-for-queries.md)
- [Lecture 091 - Feature Branch for Day 9](./lecture-091-feature-branch-day-9.md)
- [Lecture 092 - Caching issues in Next.js](./lecture-092-caching-force-dynamic.md)
- [Lecture 093 - Recap Day 9](./lecture-093-recap-day-9.md)

## Commit Evidence

Commits found for this day:

- `b188da8` - Day 9: database setup + data models
- `389beca` - fix index.ts
- `a122314` - fix db.ts error
- `1504982` - Fix mongoose cache
- `15ea5b8` - fix db.ts and in dockerfile stage
- `087d1e4` - Update Dockerfile
- `2a81aea` - fix: revalidatePath for create job
- `3745ef1` - fix: bust the layout too
- `9aaeff5` - fix: add force-dynamic

Key files added/changed:

- `lib/db.ts`
- `lib/models/job.model.ts`
- `lib/models/application.model.ts`
- `repositories/jobs.repository.ts`
- `repositories/applications.repository.ts`
- `services/jobs/jobs.service.ts`
- `services/applications/applications.service.ts`
- `services/applications/applications.validation.ts`
- `app/actions/applications/applications.action.ts`
- `app/actions/jobs/jobs.action.ts`
- `components/jobs/JobApplyForm.tsx`
- `components/applications/ApplicationsTable.tsx`
- `Dockerfile`
- `app/(admin)/dashboard/layout.tsx`
- `app/(client)/layout.tsx`

## Final State

By the end of the day, jobs and applications were backed by MongoDB.

Implemented:

- Mongoose singleton connection in `lib/db.ts`.
- `JobModel`.
- `ApplicationModel`.
- `jobs.repository.ts`.
- `applications.repository.ts`.
- Repository mappers that convert `_id` to `id` and dates to strings.
- Application creation through a Server Action and service.
- Application snapshot fields such as candidate name/email, cover letter, job title, and job company.
- Applicant count derived with aggregation instead of stored on the job document.
- Next.js dynamic rendering safeguards for DB-backed pages.

## Architecture Decisions

### Repository layer

The repository layer was introduced because direct Mongoose usage leaks database details into services:

- Mongoose documents include `_id`, `__v`, ObjectIds, and Date objects.
- Client components need plain serializable data.
- Services should work with domain types, not database documents.

The resulting flow:

```txt
Action / Server Component
  -> Service
  -> Repository
  -> Mongoose Model
  -> MongoDB
```

### Mappers

Repositories own mapping:

- `_id` -> `id`
- `Date` -> ISO date string
- remove `__v`
- ensure plain objects cross the server/client boundary

This prevents common Next.js errors like "Only plain objects can be passed to Client Components."

### Application snapshot pattern

Applications store both relationship IDs and submitted display data:

- `candidateId`
- `candidateName`
- `candidateEmail`
- `candidateLinkedin`
- `candidateCoverLetter`
- `jobId`
- `jobTitle`
- `jobCompany`
- `role`
- `aiScore`
- `status`
- `appliedDate`

The teaching point: an application is an audit-like snapshot. If a candidate or job changes later, the application still reflects what was submitted at that time.

### Applicant count

`Job.applicants` is derived through aggregation:

- `$lookup` from jobs to applications.
- `$size` of matched applications.
- Do not store applicant count directly on the job document.

## Caching and Deployment Fixes

Day 9 exposed a key Next.js/Mongoose issue: MongoDB calls are not automatically treated as dynamic in the same way as Next.js dynamic APIs.

Fixes introduced:

- `export const dynamic = "force-dynamic";`
- `export const revalidate = 0;`
- `revalidatePath(..., "layout")` after mutations.
- Dockerfile builder stage declares `ARG MONGO_URI` and exports `ENV MONGO_URI=$MONGO_URI`.

These were needed to avoid static build-time DB reads and stale production pages.

## Teaching Narrative

The day intentionally starts simple: connect MongoDB and use Mongoose. Then it exposes why putting Mongoose directly in the service is problematic. The repository layer is introduced as a response to real pain, not as theory.

The end-of-day product milestone is an application flow that persists data and shows it in the admin dashboard.

## Known Remaining Work

- Candidate identity is still temporary at this point.
- Authentication is intentionally deferred to Day 10.
- File upload/resume handling is not implemented.
- Duplicate application checks and active-job checks are future enhancements.
