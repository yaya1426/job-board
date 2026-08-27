# Lecture 114 - Supplementary: Prepare the Resume Snapshot | تجهيز بيانات السيرة الذاتية

> **Supplementary** — implementation step between Udemy Lectures 113 and 115; not a separate published lecture.

## Goal
One small win: prepare the application data model to remember a resume's key, name, size, and type. The actual form upload comes next, in Lecture 115.

## Implementation Status
**Implemented** — Application types/model store resume metadata fields.

## Key Files (as implemented today)
- `types/Application.ts`
- `lib/models/application.model.ts`
- `repositories/applications.repository.ts`

## Gaps vs This Lecture (if any)
- Legacy `candidateResume` string placeholder is gone; optional resume metadata fields are in place.

## Implementation steps
1. Add four optional fields to `types/Application.ts`: `candidateResumeKey`, `candidateResumeFileName`, `candidateResumeSize`, `candidateResumeContentType`.
2. Replace `candidateResume` placeholder in `lib/models/application.model.ts` with the four optional schema fields.
3. No repository mapper change — `...rest` spread picks up new plain fields automatically.
4. Do **not** wire upload or validation yet — Lecture 115 fills these fields from `uploadResume` return value.
5. Run `npx tsc --noEmit`; confirm existing applications without resume metadata still load.

See **Step 1–3** below for exact field definitions.

## Background
Before the form can save a real upload, the application needs fields ready to receive its details. We first replace the vague `candidateResume` placeholder with a clear **snapshot contract**.

Why a copy on the application instead of just pointing at the user's profile? Because a user can later change or delete their profile/resume, but the application should stay an honest record of *what they actually submitted that day*. It's like a receipt: it captures the moment even if things change later. This is the same "snapshot" idea already used for `candidateName` and `jobTitle`.

We are **not** uploading a file or touching AI in this lesson. One lesson, one win: the data model is ready for the next lesson.

To keep this lesson runnable, make the new fields optional for now. That also lets old applications continue to load. Lecture 115 supplies these fields for every new application.

### Jargon decoder

- **Persist** = save it to the database so it survives after the request ends.
- **Snapshot** = a frozen copy of some data at the moment of submission.
- **Object key** = the file's address in storage (e.g. `resumes/abc-123.pdf`). This is the durable reference we store.
- **Untrusted input** = anything the browser sent us. We re-validate it server-side because the browser can lie.

## Files Updated
```txt
types/Application.ts
lib/models/application.model.ts
```

Only two files change in this lesson. The repository mapper already spreads plain fields from the MongoDB document, so it does not need special code for these strings/numbers.

## Step 1 - Update `types/Application.ts`
Add the four optional fields to the public `Application` interface, after `candidateCoverLetter`:

```ts
export interface Application {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateLinkedin: string;
  candidateCoverLetter: string;

  candidateResumeKey?: string;
  candidateResumeFileName?: string;
  candidateResumeSize?: number;
  candidateResumeContentType?: string;

  jobId: string;
  // ...the existing fields stay unchanged
}
```

The new fields mean:

```txt
candidateResumeKey         -> where the PDF lives in Spaces
candidateResumeFileName    -> the candidate's original filename
candidateResumeSize        -> size in bytes
candidateResumeContentType -> "application/pdf"
```

They are optional (`?`) so applications created before Day 11 still match the type.

## Step 2 - Update `lib/models/application.model.ts`
Find the old placeholder:

```ts
candidateResume: { type: String }, // TODO: add resume file upload
```

Replace it with four explicit optional fields:

```ts
candidateResumeKey: { type: String },
candidateResumeFileName: { type: String },
candidateResumeSize: { type: Number },
candidateResumeContentType: { type: String },
```

The surrounding candidate section now looks like:

```ts
candidateName: { type: String, required: true },
candidateEmail: { type: String, required: true },
candidateLinkedin: { type: String, required: true },
candidateResumeKey: { type: String },
candidateResumeFileName: { type: String },
candidateResumeSize: { type: Number },
candidateResumeContentType: { type: String },
candidateCoverLetter: { type: String, required: true },
```

These fields deliberately are not `required` yet. Old MongoDB documents do not contain them, and the form does not fill them until Lecture 115.

## Step 3 - Why No Other File Changes
### `repositories/applications.repository.ts`

No change is needed. Its mapper already collects the remaining plain fields with:

```ts
const { _id, __v, candidateId, jobId, appliedDate, ...rest } = doc;
```

The four new values are included automatically through `...rest`. They are already serializable strings/numbers, unlike `ObjectId` and `Date`.

### Application validation and service

Do not add resume validation or fake metadata here. Lecture 115 receives the real `File`, calls `uploadResume`, and saves the returned values. This keeps the current text-only apply flow working at the end of this lesson.

## Verification
1. Run:

```bash
npx tsc --noEmit
```

2. Confirm the current apply flow still works.
3. Confirm an existing application without resume metadata still loads.
4. Inspect the schema and verify the vague `candidateResume` placeholder is gone.

## Key points
> Prepare the data shape before wiring the form that fills it.

> Store the object key, never the bytes. MongoDB describes the file; Spaces holds it.

## Next
Lecture 115 adds the real file input, uploads the PDF, and fills this snapshot in one submission.
