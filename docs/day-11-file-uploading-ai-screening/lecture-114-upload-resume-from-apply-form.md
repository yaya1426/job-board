# Lecture 114 - Upload Resume from Apply Form | رفع السيرة الذاتية من نموذج التقديم

## Goal

Replace the fake drop area with a real PDF input and direct browser-to-Spaces upload.

## Files Updated

```txt
components/jobs/JobApplyForm.tsx
app/actions/applications/applications.action.ts
services/applications/applications.validation.ts
```

## Step 1 - Add a Real File Input

Replace the static resume box with:

```tsx
<input
  type="file"
  name="resume"
  accept="application/pdf,.pdf"
  required
/>
```

Keep the brutalist styling and show the chosen filename.

## Step 2 - Change the Submit Flow

`useActionState` cannot conveniently perform a client-side presigned upload before the Server Action submission. Convert this form to a plain client submit handler, following the auth-form orchestration pattern:

```txt
submit
  -> validate selected File for UX
  -> POST metadata to /api/uploads/resume/presign
  -> PUT file to returned uploadUrl
  -> append returned key/metadata to application FormData
  -> call handleApplyToJob(formData)
```

Use local `isPending`, field errors, and form error state.

## Step 3 - Request the Signed URL

Send only metadata:

```ts
const response = await fetch("/api/uploads/resume/presign", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fileName: resume.name,
    fileSize: resume.size,
    contentType: resume.type,
  }),
});
```

## Step 4 - Upload Directly to Spaces

```ts
const uploadResponse = await fetch(uploadUrl, {
  method: "PUT",
  headers: {
    "Content-Type": resume.type,
  },
  body: resume,
});
```

Do not send cookies or Spaces credentials.

## Step 5 - Submit Metadata to the Server Action

Append:

```txt
candidateResumeKey
candidateResumeFileName
candidateResumeSize
candidateResumeContentType
```

Do not submit a trusted permanent URL from the browser. The object key is the durable reference.

## Step 6 - Make the Action Callable

Keep `"use server"` on the exported action/function as required by the project’s current action style. The action parses `FormData`, calls the application service, and returns structured errors.

## Step 7 - Handle Failure Clearly

- Presign failure: show validation/auth message.
- PUT failure: show “Resume upload failed.”
- Application save failure after upload: show application error and document that orphan cleanup is a future hardening task.
- Disable submit while either upload or application submission is pending.

## Verification

- No file selected → client message.
- Non-PDF or over 5 MB → server rejects presign request.
- Valid PDF uploads directly to Spaces.
- Application action receives object key and metadata.
- No Spaces secret appears in browser network responses.

## Key Teaching Lines

> The browser uploads the bytes, but the server controls where and for how long.

> Upload success and application creation are two operations; production systems must consider partial failure.

## Next

Lecture 115 updates the domain type/model/repository and saves the resume snapshot with `screeningStatus: PENDING`.
