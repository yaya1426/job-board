# Lecture 120 - Upload Resume to OpenAI Files API | رفع السيرة الذاتية إلى OpenAI Files API

## Goal
Read a trusted private resume from DigitalOcean Spaces on the server, validate the downloaded object, convert its bytes with `toFile`, and upload a temporary PDF with Files API purpose `"user_data"`.

## Implementation Status
**Implemented** — Spaces GetObject → toFile → OpenAI Files with one-hour expiration.

## Key Files (as implemented today)
- `services/screening/openai-files.service.ts`
- `lib/storage.ts`
- `lib/openai.ts`

## Gaps vs This Lecture (if any)
- Temporary OpenAI file IDs are not persisted (by design).

## Implementation steps
See steps below (Step 1–3). Summary:

1. Create `services/screening/openai-files.service.ts` — `GetObjectCommand` from Spaces → `toFile` → `openai.files.create({ purpose: "user_data", expires_after: { anchor: "created_at", seconds: 3600 } })`.
2. Validate downloaded object: body present, PDF content type, ≤ 5 MB.
3. Do **not** persist temporary OpenAI `file_id` in MongoDB — rely on one-hour automatic expiration.
4. Service is called from `analyzeApplicationResume` (Lecture 121), not from the apply form directly.

## Final Server-to-Server Flow
```txt
trusted candidateResumeKey
  -> GetObjectCommand against private Spaces bucket
  -> validate Body, content type, and size
  -> transformToByteArray()
  -> toFile(...)
  -> openai.files.create({ purpose: "user_data" })
  -> temporary OpenAI file id
```

No signed browser URL is needed. The server-side screening service already has credentials for Spaces. Do not save the temporary OpenAI `fileId` in MongoDB.

## Step 1 - Create the Focused Service
Create `services/screening/openai-files.service.ts`:

```ts
import "server-only";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { toFile } from "openai";
import { openai } from "@/lib/openai";
import { spacesBucket, spacesClient } from "@/lib/storage";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

type ResumeObject = {
  key: string;
};

export async function uploadResumeToOpenAI({
  key,
}: ResumeObject) {
  const object = await spacesClient.send(
    new GetObjectCommand({
      Bucket: spacesBucket,
      Key: key,
    }),
  );

  if (!object.Body) {
    throw new Error("Resume object has no body");
  }

  if (
    object.ContentType &&
    object.ContentType !== "application/pdf"
  ) {
    throw new Error("Resume object is not a PDF");
  }

  if (object.ContentLength && object.ContentLength > MAX_RESUME_SIZE) {
    throw new Error("Resume object exceeds 5 MB");
  }

  const bytes = await object.Body.transformToByteArray();

  if (bytes.byteLength === 0) {
    throw new Error("Resume object is empty");
  }

  if (bytes.byteLength > MAX_RESUME_SIZE) {
    throw new Error("Resume object exceeds 5 MB");
  }

  const fileName = key.split("/").pop() ?? "resume.pdf";

  const pdf = await toFile(Buffer.from(bytes), fileName, {
    type: "application/pdf",
  });

  return openai.files.create({
    file: pdf,
    purpose: "user_data",
    expires_after: {
      anchor: "created_at",
      seconds: 60 * 60,
    },
  });
}
```

The second size check matters because metadata can be absent or inaccurate. Upload validation from Lecture 113 remains the first boundary; this service validates again at the external-provider boundary.

## Step 2 - Understand When This Service Is Called
Do not call `uploadResumeToOpenAI()` inside the original `uploadResume()` function.

The two uploads have different responsibilities:

```txt
uploadResume()
  -> durable private storage in DigitalOcean Spaces

uploadResumeToOpenAI()
  -> temporary provider file created only when screening starts
```

The complete Day 11 order is:

```txt
1. Validate and upload the PDF to Spaces
2. Save the application and trusted resume key in MongoDB
3. Start screening with the saved application and job
4. uploadResumeToOpenAI({ key })
5. Pass the returned file.id to the Responses API
```

Lecture 121 performs steps 4–5 inside `analyzeApplicationResume()`:

```ts
const openaiFile = await uploadResumeToOpenAI({
  key: application.candidateResumeKey,
});
```

Lecture 122 calls that analysis operation after `saveNewApplication()` succeeds.

Keeping these operations separate prevents temporary OpenAI files from being created when application validation or MongoDB persistence fails. It also keeps the permanent storage provider independent from the AI provider.

Do not accept an arbitrary Spaces key from the browser. The screening service receives the application object that the server just persisted and uses its trusted snapshot key.

## Step 3 - Verify the Service
The end result of this lecture is:

```txt
existing private Spaces resume
  -> uploaded successfully to OpenAI Files API
  -> returns a temporary file id
  -> purpose is user_data
  -> expires approximately one hour later
```

Create a disposable development-only route:

```txt
app/api/openai-file-smoke/route.ts
```

```ts
import { getCurrentUser } from "@/lib/current-user";
import { getApplicationById } from "@/services/applications/applications.service";
import { uploadResumeToOpenAI } from "@/services/screening/openai-files.service";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (currentUser.role !== "ADMIN") {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  const applicationId = new URL(request.url).searchParams.get("applicationId");

  if (!applicationId) {
    return Response.json(
      { message: "applicationId is required" },
      { status: 400 },
    );
  }

  const result = await getApplicationById(applicationId);
  const application = result.success ? result.data : undefined;

  if (!application?.candidateResumeKey) {
    return Response.json({ message: "Resume not found" }, { status: 404 });
  }

  const file = await uploadResumeToOpenAI({
    key: application.candidateResumeKey,
  });

  return Response.json({
    id: file.id,
    filename: file.filename,
    purpose: file.purpose,
    bytes: file.bytes,
    createdAt: file.created_at,
    expiresAt: file.expires_at,
  });
}
```

While logged in as an admin, open:

```txt
http://localhost:3000/api/openai-file-smoke?applicationId=APPLICATION_ID
```

Expected response shape:

```json
{
  "id": "file-...",
  "filename": "2540a8fa-....pdf",
  "purpose": "user_data",
  "bytes": 123456,
  "createdAt": 1786170000,
  "expiresAt": 1786173600
}
```

Then open the OpenAI Platform Files page and confirm:

1. The file exists.
2. Its filename comes from the UUID Spaces key.
3. Its purpose is `user_data`.
4. Its expiration is approximately one hour after creation.
5. No resume bytes or contents were written to application logs.

Finally, delete the disposable route:

```txt
app/api/openai-file-smoke/route.ts
```

The uploaded OpenAI test file remains governed by its one-hour automatic expiration.

Run:

```bash
npx tsc --noEmit
npm run lint
```

## Privacy and Retention Notes
- The durable original remains in private Spaces under your retention policy.
- The one-hour `expires_after` policy is the chosen lifecycle mechanism for the temporary OpenAI file.
- The file may remain available until `expires_at`; this is a deliberate simplicity/privacy tradeoff for the first implementation.
- Application-level expiration does not promise provider zero retention beyond OpenAI project/data-control terms.

## Next
Lecture 121 sends this `file_id` to the Responses API, validates structured output, and returns the screening result. The temporary file remains governed by this one-hour automatic expiration policy.
