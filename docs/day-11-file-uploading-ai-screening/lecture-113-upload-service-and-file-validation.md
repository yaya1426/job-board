# Lecture 113 - Upload Service and File Validation | خدمة رفع الملفات والتحقق من الملفات

## Goal

One small win: take an uploaded PDF, validate it on the server, and store it privately in DigitalOcean Spaces. That's the whole lesson. (Admin *downloads* come later, in Lecture 117, exactly when we build the screen that needs them.)

## Explain It Simply (For Beginners)

We use the plain, familiar **backend/frontend** model here:

1. The candidate picks a PDF and submits the apply form — the file rides along like any other field.
2. The request reaches **our server**, which checks the logged-in candidate, validates the file (real PDF? under 5 MB?), and then uploads it to private storage.
3. The server saves the file's **key** (its address in storage) on the application and responds.

That's it. One request. The file goes browser → our server → Spaces. It's like handing a document to a clerk at the counter: they check it and file it in the back for you.

### "Do I even need a presigned URL?" — No, not here.

There's a fancier approach where the browser uploads *directly* to storage and the server only hands out a temporary "upload permission slip" (a **presigned URL**). It scales better because the file never passes through your server — but it adds a lot of moving parts (an extra route, a two-step upload handshake, and bucket CORS).

For this app (a 5 MB resume cap, course-scale traffic) that complexity isn't worth it. We stream through our own server because it's simple and easy to reason about. **Presigned direct-upload is the upgrade you reach for later, when server bandwidth actually becomes the pain point.** We'll name it as future hardening, not build it now.

> Teaching line: *We trade a little scalability for a lot of simplicity — and we say so out loud.*

> Note: the bucket is **private**, so there's no public link to a resume. We don't need to solve "how does an admin open it?" yet — that's Lecture 117's job. This lesson stops at "the file is safely stored."



### Jargon decoder

- **Object key** = the file's address inside the bucket, e.g. `resumes/abc-123.pdf`. We store this on the application, not the file's bytes.
- `PutObjectCommand` = the S3 SDK command to upload a file.
- **Server Action body limit** = Next.js caps how big a Server Action request can be (~1 MB by default). Since the file now travels through the action, we raise it (see the config note below).



## Files Created

```txt
lib/storage.ts
services/uploads/uploads.validation.ts
services/uploads/uploads.service.ts
```

> Config note: because the resume's bytes now travel through a Server Action, raise the limit in `next.config.ts` so a 5 MB PDF isn't rejected:
>
> ```ts
> const nextConfig = {
>   // ...existing config
>   experimental: {
>     serverActions: { bodySizeLimit: "6mb" },
>   },
> };
> ```
>
> (Slightly above 5 MB to leave room for the other form fields.)



## Step 1 - Configure the Storage Client

Create `lib/storage.ts`.

This code uses the AWS SDK, `Buffer`, and Node's crypto APIs, so it must run in the **Node.js runtime**, not the Edge runtime. Next.js Server Actions use Node.js by default in this app.

Responsibilities:

- Read required `DO_SPACES_*` variables.
- Fail with a clear message when configuration is missing.
- Export one S3-compatible client.
- Export bucket configuration.

```ts
import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export const spacesBucket = requireEnv("DO_SPACES_BUCKET");

export const spacesClient = new S3Client({
  endpoint: requireEnv("DO_SPACES_ENDPOINT"),
  region: requireEnv("DO_SPACES_REGION"),
  credentials: {
    accessKeyId: requireEnv("DO_SPACES_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("DO_SPACES_SECRET_ACCESS_KEY"),
  },
});
```



## Step 2 - Define Validation Rules

Create `services/uploads/uploads.validation.ts`.

For the first version, accept PDF only because Lecture 118 extracts PDF text.

```ts
import { z } from "zod";

export const MAX_RESUME_SIZE = 5 * 1024 * 1024;
export const PDF_CONTENT_TYPE = "application/pdf";

export const resumeUploadRequestSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  fileSize: z.number().int().positive().max(
    MAX_RESUME_SIZE,
    "Resume must be 5MB or smaller",
  ),
  contentType: z.literal(PDF_CONTENT_TYPE, {
    error: "Resume must be a PDF file",
  }),
});

export type ResumeUploadRequest = z.infer<
  typeof resumeUploadRequestSchema
>;
```

Explain that browser `accept=".pdf"` is UX only; server validation is authoritative.

## Step 3 - Create the Upload Service

Create `services/uploads/uploads.service.ts`.

The service has **one** job for now: take a real `File`, validate it, and upload the bytes with `PutObjectCommand`. It returns the object key and metadata. That's all this lesson needs.

```ts
import "server-only";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { spacesBucket, spacesClient } from "@/lib/storage";
import { resumeUploadRequestSchema } from "./uploads.validation";

export async function uploadResume(file: File) {
  // Validate the ACTUAL uploaded file, server-side. The browser cannot be trusted.
  const validated = resumeUploadRequestSchema.parse({
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type,
  });

  // The server owns the key. Never use the raw filename as the object path.
  const key = `resumes/${randomUUID()}.pdf`;
  const bytes = Buffer.from(await file.arrayBuffer());

  await spacesClient.send(
    new PutObjectCommand({
      Bucket: spacesBucket,
      Key: key,
      Body: bytes,
      ContentType: validated.contentType,
    }),
  );

  return {
    key,
    fileName: validated.fileName,
    fileSize: validated.fileSize,
    contentType: validated.contentType,
  };
}
```

Two teaching points: the server generates the key (so a malicious filename can't control the storage path), and the upload reuses the same zod schema as validation so there is exactly one source of truth for "what counts as a valid resume."

> We'll add a `createResumeDownloadUrl` helper to this same file later, in Lecture 117, when the admin screen actually needs to open a resume. No need to write it now.



## Step 4 - Where Auth and Upload Happen (No Separate Route)

With the server-proxied approach there is **no presign route and no extra upload endpoint.** The upload happens *inside the existing apply Server Action* (wired up in Lecture 115). That action already:

- runs `getCurrentUser()` to confirm a logged-in candidate, and
- receives the whole form, including the resume `File`.

So it just calls `uploadResume(file)`, gets back a `key`, and saves that key with the rest of the application. One request does auth + validation + upload + save.

### How the pieces talk to each other

```txt
  [ Browser ]                 [ Our Server ]                 [ DigitalOcean Spaces ]
  apply form                  apply Server Action            the private bucket
      |                            |                              |
      | 1. submit form + PDF file  |                              |
      | -------------------------> |                              |
      |                            | 2. getCurrentUser() ok?      |
      |                            |    validate file (zod):      |
      |                            |    PDF? <= 5 MB?             |
      |                            |                              |
      |                            | 3. PutObjectCommand          |
      |                            |    (upload the bytes)        |
      |                            | ---------------------------> |
      |                            |                              |
      |                            | 4. returns object key        |
      |                            | <--------------------------- |
      |                            |                              |
      |                            | 5. save application + key    |
      | 6. success (or field errors)|                             |
      | <------------------------- |                              |
```

Key point for learners: the file bytes **do** pass through our server this time (step 1 → 3). That's the deliberate simplicity/scalability trade-off from the intro. The server is the single gatekeeper: it authenticates, validates, and uploads in one place.

### Why this is simpler than the presigned version

- No `/api/uploads/resume/presign` route to build, secure, and explain.
- No client-side "get a URL, then PUT to it" handshake.
- No bucket CORS needed for uploads (the browser never calls Spaces directly).
- Auth reuses the apply action's existing `getCurrentUser()` check — nothing new.



### Where validation errors surface

`uploadResume` calls `resumeUploadRequestSchema.parse(...)`, so an invalid file (not a PDF, too big) throws a `ZodError`. The apply action catches it and returns field errors in the usual `ServiceResult` shape — the same pattern every other form in the app already uses. No custom HTTP status codes to hand-roll.

### Cleanup

*Remove the placeholder* `app/api/jobs/route.ts`*; it is an unrelated “Hello, world” experiment and is not part of this flow.*

## Step 5 - Explain the Security Boundary

Even though uploads now go through our server, the security rules are the same:

- The bucket stays **private** — no `public-read`, no public URLs to resumes.
- The **server** is the only thing holding Spaces credentials; they never reach the browser.
- Only an authenticated candidate can trigger an upload (the apply action checks this in Lecture 115).

(How admins later *read* a private file is a Lecture 117 concern — we don't touch it here.)

## Step 6 - Verify

Because the form is not wired until Lecture 115, make this lesson's result visible with a temporary **server-side** test of `uploadResume`:

- a valid PDF returns a `key` and the object appears in the private bucket
- a non-PDF is rejected by validation
- a file over 5 MB is rejected
- the resume is **not** publicly reachable by URL

Log only the returned key—never the file contents or credentials—then remove the temporary test before committing. Do not create a permanent debug route.

## Key Teaching Lines

> Validation runs on the real file, server-side. Browser `accept=".pdf"` is only a hint.

> The server owns the object key, so a malicious filename can never control the storage path.

> One lesson, one job: this lesson only proves we can store a file safely. Reading it back comes later.

> Presigned direct-upload is a scaling upgrade for later, not a requirement now.



## End State

The backend can validate a resume and store it privately. The apply form still does not upload yet, and reading files back (admin downloads) is not built until Lecture 117.

## Next

Lecture 114 prepares the application type, model, and repository to store the resume snapshot before the form starts filling it.