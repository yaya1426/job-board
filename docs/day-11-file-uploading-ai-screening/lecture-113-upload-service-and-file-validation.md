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

## *Step 4 - Add the Presign Route*

### The idea in one sentence

The browser is not allowed to hold our Spaces secret keys, so it asks **our server** for a temporary permission slip (a *presigned URL*), and only then uploads the file straight to Spaces.

Think of it like a coat check. You don't get the key to the whole cloakroom; you get a single ticket that only works for your one coat, for a short time.

### How the pieces talk to each other

```txt
  [ Browser ]                 [ Our Server ]              [ DigitalOcean Spaces ]
  apply form                  presign route               the storage bucket
      |                            |                              |
      | 1. "I want to upload       |                              |
      |    resume.pdf, PDF,        |                              |
      |    120 KB"  (JSON)         |                              |
      | -------------------------> |                              |
      |                            | 2. check: logged in?         |
      |                            |    role = CANDIDATE?          |
      |                            |    metadata valid? (zod)     |
      |                            |                              |
      |                            | 3. sign a short-lived URL    |
      |                            |    using our secret keys     |
      |                            |    (keys never leave server) |
      |                            |                              |
      | 4. { key, uploadUrl }      |                              |
      | <------------------------- |                              |
      |                            |                              |
      | 5. PUT the actual file straight to Spaces using uploadUrl  |
      | ---------------------------------------------------------> |
      |                            |                              |
      | 6. 200 OK (file stored)                                    |
      | <--------------------------------------------------------- |
```

Key point for learners: the file bytes never pass through our server. Our server only issues permission (steps 1-4). The heavy upload (step 5) goes browser -> Spaces directly.

### What this route is (and is not)

Steps 1-3 already built the *service* that knows how to sign a URL (`createResumeUploadUrl`). Step 4 is just the **front door** for that service over HTTP: a thin route that adds two things the service doesn't do on its own — *who is asking* (auth) and *reading the request body* (parse JSON). The signing itself stays in the service.

### Create `app/api/uploads/resume/presign/route.ts`

*The route must:*

1. *Require a logged-in user.* → nobody anonymous should be able to mint upload permissions.
2. *Require* `CANDIDATE` *role if candidate-only uploads are enforced.* → only candidates upload resumes.
3. *Parse JSON metadata.* → read `{ fileName, fileSize, contentType }` from the request body.
4. *Call* `createResumeUploadUrl`*.* → let the service validate and sign.
5. *Return safe JSON; never return credentials.* → return `{ key, uploadUrl }`, never anything from `lib/storage.ts`.
6. *Return* `400` *for validation errors and* `401/403` *for auth errors.*

### Which status code means what

| Situation | Status | Meaning |
| --- | --- | --- |
| Not logged in | `401 Unauthorized` | "I don't know who you are." |
| Logged in, wrong role | `403 Forbidden` | "I know you, but you're not allowed." |
| Allowed, but bad file metadata | `400 Bad Request` | "Your request is malformed" (not a PDF, too big). |
| All good | `200 OK` | Returns `key` + `uploadUrl`. |

Because `createResumeUploadUrl` uses `schema.parse(...)`, invalid metadata throws a `ZodError`. We catch it and turn it into a `400`.

### The route

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/current-user";
import { createResumeUploadUrl } from "@/services/uploads/uploads.service";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: "You must be logged in to upload" },
      { status: 401 },
    );
  }

  if (currentUser.role !== "CANDIDATE") {
    return NextResponse.json(
      { error: "Only candidates can upload resumes" },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const result = await createResumeUploadUrl(body);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: z.flattenError(error).fieldErrors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Could not create upload URL" },
      { status: 500 },
    );
  }
}
```

Why `POST` and not `GET`? The client is *sending* data (the file description) and asking us to *create* something (a permission slip). `GET` is for reading; `POST` is for "here is a body, do something with it."

*Do not use the existing placeholder* `app/api/jobs/route.ts`*; remove that unrelated experiment when the user is ready.*

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