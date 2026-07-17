# Lecture 115 - Upload Resume from Apply Form | رفع السيرة الذاتية من نموذج التقديم

## Goal

Replace the fake drop area with a real PDF input, and let the apply Server Action upload the file to private Spaces — all in one submission, keeping the existing `useActionState` pattern.

## Explain It Simply (For Beginners)

This is where the front-end finally does something real — and pleasantly, it stays **simple**. When the candidate hits **Submit**, the file rides along with the rest of the form in a single request. On the server, our apply action:

1. Confirms the candidate is logged in.
2. Validates the file (real PDF? under 5 MB?).
3. Uploads it to private Spaces and gets back an object **key**.
4. Saves that key with the application.

An analogy: you hand your document to a clerk at the counter. They check it, file it in the back, and write the file's location on your form. You don't run to the archive room yourself.

**Good news about the form pattern:** because everything happens in one request, we do **not** need the awkward multi-step client handler. The form stays a normal `useActionState` form (Pattern A in `AGENTS.md`) — the resume `File` is just another field in the `FormData`. This is much easier to teach than the presigned/direct-upload dance.

**One honest trade-off to name:** the file's bytes now travel through our server, so we must raise the Next.js Server Action body limit (see the config step). At course scale that's fine.

### Jargon decoder

- **`accept=".pdf"`** = a browser hint that filters the file picker. It's *convenience only*; the server still re-checks, because anyone can bypass the browser.
- **`FormData`** = the object that packages form fields *and the file itself* to send to the server action.
- **`File` in a Server Action** = you read it with `formData.get("resume")`; it arrives as a `File`/`Blob` you can validate and upload.
- **Object key** = the file's address in storage (e.g. `resumes/abc-123.pdf`). We save this on the application, never the raw bytes.
- **`bodySizeLimit`** = the Next.js cap on Server Action request size (~1 MB by default); we raise it so a 5 MB PDF is accepted.

## Files Updated

```txt
next.config.ts
components/jobs/JobApplyForm.tsx
app/actions/applications/applications.action.ts
services/applications/applications.validation.ts
```

## Step 1 - Raise the Server Action Body Limit

Since the file now travels through the Server Action, raise the limit in `next.config.ts`:

```ts
const nextConfig = {
  // ...existing config
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
};
```

(Slightly above the 5 MB resume cap to leave room for the other fields.)

## Step 2 - Add a Real File Input

Replace the static resume box with:

```tsx
<input
  type="file"
  name="resume"
  accept="application/pdf,.pdf"
  required
/>
```

Keep the brutalist styling and show the chosen filename. The form stays a normal `useActionState` form bound with `action={formAction}` — no client submit handler needed.

## Step 3 - Read and Upload the File in the Action

The apply Server Action now pulls the `File` out of `FormData`, and the application service uploads it before saving. Keep business logic in the service; the action stays thin.

```ts
// app/actions/applications/applications.action.ts (inside the action)
const resume = formData.get("resume");
// pass the File plus the text fields to the service
```

```ts
// services/applications/applications.service.ts (inside applyToJob)
import { uploadResume } from "@/services/uploads/uploads.service";

// after auth + text validation:
if (!(resume instanceof File) || resume.size === 0) {
  return { success: false, errors: { resume: ["Resume is required"] } };
}

const uploaded = await uploadResume(resume); // validates + stores, returns { key, ... }
```

`uploadResume` (from Lecture 113) validates the PDF and size, generates the server-owned key, and stores the bytes. A validation failure throws a `ZodError` the service maps into `ServiceResult` field errors.

## Step 4 - Save the Snapshot Fields

Save these into the snapshot fields prepared in Lecture 114:

```txt
candidateResumeKey        <- uploaded.key
candidateResumeFileName   <- uploaded.fileName
candidateResumeSize       <- uploaded.fileSize
candidateResumeContentType <- uploaded.contentType
```

Store the object **key**, never a permanent public URL. The key is the durable reference; download URLs are signed fresh on demand.

## Step 5 - Handle Failure Clearly

- No file / empty file: return a `resume` field error.
- Invalid file (not PDF, too big): the `uploadResume` validation returns field errors — rendered like any other field.
- Upload failure (storage error): return a form-level error (“Resume upload failed, please try again”).
- Read `isPending` directly from React 19's `useActionState` return value and use it to disable the submit button:

```ts
const [state, formAction, isPending] = useActionState(
  handleApplyToJob,
  initialState,
);
```

Because upload and save happen in the *same* server call, there is no browser-side partial-failure window. If upload succeeds but the database save fails afterward, an orphan object can still remain; name cleanup as future hardening.

## Verification

- No file selected → `required` blocks submit; server also returns a `resume` error.
- Non-PDF or over 5 MB → server rejects with a field error.
- Valid PDF → object appears in the private bucket and the application saves its key.
- The form still uses `useActionState`; no `/api/uploads/.../presign` route exists.
- No Spaces secret ever appears in the browser.

## Key Teaching Lines

> The file is just another form field; the server validates, uploads, and saves it in one request.

> Store the object key, not a public URL — downloads are signed on demand.

> Keeping the single-request Server Action means one place to reason about success and failure.

## Next

Lecture 116 introduces `screeningStatus: PENDING` and removes the fake `aiScore: 0`.
