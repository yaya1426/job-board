# Lecture 087 - Applications: Model & Repository Logic | نموذج ومستودع الطلبات

## Goal

Define the `Application` Mongoose schema with snapshot fields, create `applications.repository.ts`, and teach why applications store both relationship IDs and submitted display data.

## Explain It Simply (For Beginners)

When someone applies to a job, we need to remember **what they submitted that day** — even if they later change their name or the job title changes.

So an application document stores:

- **Links** — `candidateId`, `jobId`
- **Snapshots** — `candidateName`, `candidateEmail`, `jobTitle`, `jobCompany`, cover letter text, etc.

Think of it like a signed PDF copy of a form, not a live link to the original.

> At Day 9, `candidateId` is still temporary (hardcoded or placeholder). Day 10 replaces it with the authenticated user's id.

## Files

- `lib/models/application.model.ts`
- `types/Application.ts`
- `repositories/applications.repository.ts`

## Core Schema Fields (Day 9)

| Field | Purpose |
|-------|---------|
| `candidateId` | ObjectId ref (temporary until auth) |
| `candidateName` | Snapshot |
| `candidateEmail` | Snapshot |
| `candidateLinkedin` | Snapshot |
| `candidateCoverLetter` | Snapshot |
| `candidateResume` | Placeholder string (file upload is Day 11) |
| `jobId` | ObjectId ref to Job |
| `jobTitle` | Snapshot from job at apply time |
| `jobCompany` | Snapshot |
| `role` | Snapshot (usually job title) |
| `aiScore` | Number, default `0` until screening exists |
| `status` | `SUBMITTED \| REVIEW \| SHORTLIST \| INTERVIEW \| REJECTED` |
| `appliedDate` | Date, default now |

## Repository Functions

| Function | Purpose |
|----------|---------|
| `saveNewApplication(data)` | Create document; convert string ids to `ObjectId` where needed |
| `findAllApplications()` | Admin table source |
| `findApplicationById(id)` | Detail views |

## Mapper: `toApplication`

Same rules as jobs:

- `_id` → `id`
- `candidateId`, `jobId` → strings
- `appliedDate` → ISO date string
- strip `__v`

## Recording Steps

1. Create the application schema with enum `status`.
2. Explain snapshot vs live data with a whiteboard example: candidate renames themselves after applying.
3. Implement `toApplication` and `saveNewApplication`.
4. Wire `findAllApplications` for the admin applications page.
5. Note TODOs left for later: duplicate-application check, active-job check, real auth candidate id.

## Key Teaching Lines

> An application is an audit record of a submission, not a live join.

> Store what the user saw when they clicked Apply.

## End State

Application persistence exists at the repository layer. Creation flow comes in Lecture 088.

## Next

Lecture 088 connects the apply form to `saveNewApplication` through the service and Server Action.
