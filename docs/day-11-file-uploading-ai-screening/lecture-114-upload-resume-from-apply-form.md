# Lecture 114 - Upload Resume from Apply Form | رفع السيرة الذاتية من نموذج التقديم

## Goal

Replace the fake drop area with a real PDF input and direct browser-to-Spaces upload.

## Explain It Simply (For Beginners)

This is where the front-end finally does something real. When the candidate hits **Submit**, three things now happen in order, all from the browser:

1. **Ask permission**: send just the file's *description* (name, size, type) to our presign route, and get back a temporary upload link.
2. **Upload the file**: `PUT` the actual PDF straight to Spaces using that link.
3. **Submit the application**: send the form fields *plus the file's key* (its address in storage) to our normal apply action.

An analogy: you don't mail your original passport to a company. You get it verified, then send them the *reference number*. Same here — the big file goes to storage once, and the application only carries the small "reference" (the object key).

**Why switch away from `useActionState` here?** Our other forms submit in one step. This form needs to do several `await` steps *in a row* (ask → upload → submit) and react to each result. That sequencing is exactly the "plain client handler" pattern we already use for login/signup (Pattern B in `AGENTS.md`), so we reuse it.

**Two operations, not one:** the file upload and the application save are separate. It's possible for the upload to succeed and the save to fail, leaving a lonely "orphan" file. That's a known trade-off we name now and clean up later — not a bug to panic about.

### Jargon decoder

- **`accept=".pdf"`** = a browser hint that filters the file picker. It's *convenience only*; the server still re-checks, because anyone can bypass the browser.
- **`FormData`** = the object that packages form fields (and now the resume key) to send to the server action.
- **`isPending`** = a true/false flag we flip on while uploading so we can disable the button and avoid double submits.
- **Orphan object** = an uploaded file whose application never got saved, so nothing points to it.

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
