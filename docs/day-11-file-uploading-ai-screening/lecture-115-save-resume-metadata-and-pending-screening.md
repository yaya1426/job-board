# Lecture 115 - Save Resume Metadata and Pending Screening | حفظ بيانات السيرة وتجهيز التقييم

## Goal

Persist a durable resume snapshot on each application and initialize automated screening state.

## Explain It Simply (For Beginners)

The file is now sitting safely in Spaces. But an application needs to *remember* which file belongs to it and how far along the AI review is. This lecture updates the database side so each application carries:

- a **snapshot** of the resume (its key, name, size, type), and
- a **screening status** that starts at `PENDING`.

Why store a copy of the file details on the application instead of just linking to the user's profile? Because a user can later change or delete their profile/resume, but the application should stay an honest record of *what they actually submitted on that day*. It's like a receipt: it captures the moment, even if prices change later. This is the same "snapshot" idea already used for `candidateName`, `jobTitle`, etc.

One subtle but important point students miss: **a missing score is not a score of zero.** The old code faked `aiScore: 0`, which looks like "this candidate scored 0/100" — terrible and untrue. Instead we leave the score *absent* until the AI actually finishes, and we track progress with `screeningStatus` (`PENDING` → `PROCESSING` → `COMPLETED`/`FAILED`).

### Jargon decoder

- **Persist** = save it to the database so it survives after the request ends.
- **Snapshot** = a frozen copy of some data at the moment of submission.
- **Enum** = a field allowed to be only one of a fixed set of values (here: the four screening statuses).
- **Untrusted input** = anything the browser sent us. We re-validate it server-side because the browser can lie.
- **Optional field** = a field that may be absent (like `aiScore` before screening finishes), different from a field that is present but empty/zero.

## Files Updated

```txt
types/Application.ts
lib/models/application.model.ts
repositories/applications.repository.ts
services/applications/applications.validation.ts
services/applications/applications.service.ts
```

## Step 1 - Update the Domain Type

Replace the placeholder with explicit metadata:

```ts
candidateResumeKey: string;
candidateResumeFileName: string;
candidateResumeSize: number;
candidateResumeContentType: string;
screeningStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
```

AI result fields can be introduced now as optional fields or in Lecture 121:

```ts
aiScore?: number;
aiSummary?: string;
aiStrengths?: string[];
aiRisks?: string[];
screenedAt?: string;
screeningError?: string;
```

## Step 2 - Update the Mongoose Schema

- Remove `candidateResume`.
- Add required resume metadata fields.
- Add `screeningStatus` enum with default `PENDING`.
- Make `aiScore` optional instead of writing the fake value `0`.

## Step 3 - Validate Metadata

Extend `applyToJobSchema`:

- key must start with the expected `resumes/` prefix
- filename is required
- size is positive and at most 5 MB
- content type must be `application/pdf`

Treat browser-provided metadata as untrusted.

Optional hardening: issue an upload token/record or use `HeadObject` to verify that the object exists and matches size/content type before saving.

## Step 4 - Save the Snapshot

Update `applyToJob`:

```txt
validate input
  -> verify job/current candidate
  -> save application with resume metadata
  -> screeningStatus=PENDING
  -> no fake aiScore
```

## Step 5 - Update Repository Mapping

Ensure:

- `_id`/ObjectIds become strings
- dates become ISO strings
- optional AI fields remain serializable
- new arrays are plain arrays

## Step 6 - Plan Partial-Failure Cleanup

If the file uploads but application save fails, an orphan object can remain. Document options:

- delete it in the error path
- scheduled cleanup of unreferenced keys
- create an upload record with expiry

The course can defer cleanup, but should name the trade-off.

## Verification

- New applications contain resume key and metadata.
- Actual PDF bytes are not stored in MongoDB.
- New applications start as `PENDING`.
- `aiScore` is absent until screening completes.
- Existing applications without new fields are handled or reseeded for the tutorial.

## Key Teaching Lines

> The application stores a snapshot of what was submitted, not only a pointer on the editable user profile.

> A missing score is different from a score of zero.

## Next

Lecture 116 displays private resume access and screening status in the admin application UI.
