# Lecture 113 - Upload Service and File Validation | خدمة رفع الملفات والتحقق من الملفات

## Goal

Build the server-only storage foundation that validates resume metadata and generates short-lived signed upload/download URLs.

## Files Created

```txt
lib/storage.ts
services/uploads/uploads.validation.ts
services/uploads/uploads.service.ts
app/api/uploads/resume/presign/route.ts
```

## Step 1 - Configure the Storage Client

Create `lib/storage.ts`.

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

For the first version, accept PDF only because Lecture 117 extracts PDF text.

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

```ts
import "server-only";
import {
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";
import { spacesBucket, spacesClient } from "@/lib/storage";
import {
  resumeUploadRequestSchema,
  type ResumeUploadRequest,
} from "./uploads.validation";

const SIGNED_URL_TTL_SECONDS = 5 * 60;

export async function createResumeUploadUrl(input: ResumeUploadRequest) {
  const validated = resumeUploadRequestSchema.parse(input);
  const key = `resumes/${randomUUID()}.pdf`;

  const uploadUrl = await getSignedUrl(
    spacesClient,
    new PutObjectCommand({
      Bucket: spacesBucket,
      Key: key,
      ContentType: validated.contentType,
    }),
    { expiresIn: SIGNED_URL_TTL_SECONDS },
  );

  return {
    key,
    uploadUrl,
    fileName: validated.fileName,
    fileSize: validated.fileSize,
    contentType: validated.contentType,
  };
}

export async function createResumeDownloadUrl(key: string) {
  return getSignedUrl(
    spacesClient,
    new GetObjectCommand({
      Bucket: spacesBucket,
      Key: key,
    }),
    { expiresIn: SIGNED_URL_TTL_SECONDS },
  );
}
```

The server generates the key. Never use the raw filename as an object path.

## Step 4 - Add the Presign Route

Create `app/api/uploads/resume/presign/route.ts`.

The route must:

1. Require a logged-in user.
2. Require `CANDIDATE` role if candidate-only uploads are enforced.
3. Parse JSON metadata.
4. Call `createResumeUploadUrl`.
5. Return safe JSON; never return credentials.
6. Return `400` for validation errors and `401/403` for auth errors.

Do not use the existing placeholder `app/api/jobs/route.ts`; remove that unrelated experiment when the user is ready.

## Step 5 - Explain the Security Boundary

The signed URL grants permission only to:

- one object key
- one HTTP method (`PUT`)
- one content type
- a short time window

It does not reveal Spaces credentials.

## Step 6 - Verify Without the Form

Use a temporary REST client request:

```json
{
  "fileName": "resume.pdf",
  "fileSize": 120000,
  "contentType": "application/pdf"
}
```

Verify:

- unauthenticated request is rejected
- non-PDF is rejected
- file over 5 MB is rejected
- valid metadata returns `key` and `uploadUrl`
- URL expires after the configured window

Do not commit a permanent debug route or credentials.

## Key Teaching Lines

> We validate upload intent before granting permission to upload.

> A presigned URL is temporary permission, not a storage credential.

> PDF-only keeps the upload contract aligned with the text-extraction lesson.

## End State

The backend can safely issue signed upload/download URLs. The apply form still does not upload yet.

## Next

Lecture 114 wires the file input to the presign route, uploads directly to Spaces, and submits the resulting metadata.
