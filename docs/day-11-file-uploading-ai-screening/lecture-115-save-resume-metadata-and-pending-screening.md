# Lecture 115 - Save Resume Metadata and Pending Screening | حفظ بيانات السيرة وتجهيز التقييم

## Goal

Persist a durable resume snapshot on each application and initialize automated screening state.

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
