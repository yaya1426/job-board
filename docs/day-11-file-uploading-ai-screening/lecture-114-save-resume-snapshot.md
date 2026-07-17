# Lecture 114 - Prepare the Resume Snapshot | تجهيز بيانات السيرة الذاتية

## Goal

One small win: prepare the application data model to remember a resume's key, name, size, and type. The actual form upload comes next, in Lecture 115.

## Explain It Simply (For Beginners)

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
repositories/applications.repository.ts
services/applications/applications.validation.ts
services/applications/applications.service.ts
```

## Step 1 - Update the Domain Type

Replace the placeholder `candidateResume` with explicit metadata:

```ts
candidateResumeKey?: string;
candidateResumeFileName?: string;
candidateResumeSize?: number;
candidateResumeContentType?: string;
```

## Step 2 - Update the Mongoose Schema

- Remove the old `candidateResume` string placeholder.
- Add the four optional resume metadata fields above.
- Remove the service's old fake `candidateResume` value so the project still compiles.

## Step 3 - Define the Future Validation Contract

Write down the rules Lecture 115 will enforce once the form supplies a real file:

- key must start with the expected `resumes/` prefix
- filename is required
- size is positive and at most 5 MB
- content type must be `application/pdf`

Do not add fake values just to satisfy the model. The real values will come from `uploadResume`.

## Step 4 - Update Repository Mapping

Ensure the mapper handles both old records and the future uploaded snapshot:

- `_id`/ObjectIds become strings
- dates become ISO strings
- optional resume fields remain optional plain values

## Step 5 - Keep the Existing App Working

- Existing applications still load without resume metadata.
- The current text-only apply flow still compiles.
- No fake key or filename is introduced.

## Verification

- TypeScript and the current app still work.
- The model exposes the four explicit resume snapshot fields.
- Existing applications without those fields still load.

## Key Teaching Lines

> Prepare the data shape before wiring the form that fills it.

> Store the object key, never the bytes. MongoDB describes the file; Spaces holds it.

## Next

Lecture 115 adds the real file input, uploads the PDF, and fills this snapshot in one submission.
