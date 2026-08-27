# Lecture 088 - Applications: Create New Application Logic | إنشاء طلب جديد

## Goal
Complete the end-to-end apply flow: validate input, load the job, build snapshot fields, persist through the repository, and show the new application in admin.

## Background
Applying is a **mutation** — it changes server state. The Day 8 pattern still applies:

1. `JobApplyForm` (client) binds a Server Action with `useActionState`
2. Action parses `FormData` and calls the service
3. Service validates with Zod, loads the job, builds the application object
4. Repository saves to MongoDB
5. Action calls `revalidatePath` so lists refresh

The form still collects candidate name, email, LinkedIn, and cover letter. The service copies job title/company from the fetched job document into snapshot fields.

## Files
- `services/applications/applications.service.ts`
- `services/applications/applications.validation.ts`
- `app/actions/applications/applications.action.ts`
- `components/jobs/JobApplyForm.tsx`
- `components/applications/ApplicationsTable.tsx`

## Service Flow (`applyToJob`)
```txt
safeParse input
  -> findJobById(jobId)
  -> if missing job, return field error
  -> build application payload with snapshots
  -> saveNewApplication(...)
  -> return ServiceResult<Application>
```

Day 9 candidate identity is still temporary:

```ts
// Day 9 placeholder — replaced in Day 10 with getCurrentUser().id
candidateId: "<hardcoded-or-mock-id>"
```

Call this out explicitly so students are not surprised on Day 10.

## Action Responsibilities
- Convert `FormData` to plain object
- Call `applyToJob`
- On failure: return `{ errors }` for `useActionState`
- On success: `revalidatePath` for job page and/or applications list

## Implementation steps
1. Define `applyToJobSchema` in `services/applications/applications.validation.ts` with human-readable Zod messages.
2. Implement `applyToJob` in `services/applications/applications.service.ts`:

```txt
safeParse input
  -> findJobById(jobId) — return field error if missing
  -> build payload with job snapshots (jobTitle, jobCompany, role)
  -> candidateId: temporary mock id (Day 10: getCurrentUser().id)
  -> saveNewApplication(...)
  -> return ServiceResult<Application>
```

3. Wire `handleApplyToJob` in `app/actions/applications/applications.action.ts` — parse `FormData`, call service, return `{ errors }` on failure.
4. On success: `revalidatePath(\`/jobs/${jobId}\`)` (and dashboard paths as needed).
5. Bind `JobApplyForm` with `useActionState` (Pattern A).
6. Submit from job details; confirm document in Atlas and admin applications table.

## Key points
> The form submits intent. The service decides what gets stored.

> Never trust client-submitted job title or company — load the job server-side and snapshot from the database.

## End State
Candidates can apply; admins see persisted applications. Data survives restarts.

## Next
Lecture 089 covers manual cleanup of test applications in Atlas.
