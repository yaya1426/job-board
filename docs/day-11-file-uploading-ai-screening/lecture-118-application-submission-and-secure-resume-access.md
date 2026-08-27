# Lecture 118 - Application Submission and Secure Resume Access | تفاصيل التقديم والوصول الآمن للسيرة الذاتية

## Goal
Extend the application details page with the submitted cover letter and resume metadata, prove that the raw private object URL correctly returns `403`, and let authorized admins open resumes through a short-lived signed URL.

## Implementation Status
**Partial** — Secure admin resume download works; route path and UI differ from the lecture.

## Key Files (as implemented today)
- `app/(admin)/dashboard/applications/[applicationId]/resume/route.ts`
- `components/applications/details/ApplicationSubmissionDetails.tsx`
- `services/uploads/uploads.service.ts`
- `app/(admin)/dashboard/applications/[applicationId]/page.tsx`

## Gaps vs This Lecture (if any)
- **Resume route path:** implemented at `app/(admin)/dashboard/applications/[applicationId]/resume/route.ts`, **not** `app/api/applications/[applicationId]/resume/route.ts`.
- UI link uses `/dashboard/applications/${application.id}/resume` and currently displays the storage key — not filename/size + Button from the lecture.
- Signed URL TTL is 15 minutes in code vs five minutes in the lecture.
- Raw private URL 403 demonstration step may need manual setup; final UI skips the temporary raw-link teaching step.

## As Implemented Today
The protected GET handler lives under the **admin dashboard route tree**, not `/api/applications/...`. When updating `ApplicationSubmissionDetails`, point the OPEN RESUME link at `/dashboard/applications/${application.id}/resume`. Authorization still checks `getCurrentUser()` + `role === "ADMIN"`, loads the trusted key from MongoDB, and redirects to a presigned Spaces URL.

## Implementation steps
See steps below (Step 1–7). Summary:

1. Create `ApplicationSubmissionDetails` — cover letter + resume metadata + OPEN RESUME link.
2. Add `createResumeDownloadUrl(key)` to `services/uploads/uploads.service.ts` (signed GET, 15 min TTL in code).
3. Create protected route at **`app/(admin)/dashboard/applications/[applicationId]/resume/route.ts`** — **not** under `app/api/applications/...`.
4. Route flow: `getCurrentUser()` → `role === "ADMIN"` → `getApplicationById` → trusted `candidateResumeKey` → redirect to presigned URL.
5. Link from UI: `/dashboard/applications/${application.id}/resume`.
6. **As implemented today**: signed URL TTL is 15 minutes (lecture teaches 5); UI may show storage key instead of filename/size.

## Starting Point
Lecture 117 created:

```txt
components/applications/details/ApplicationCandidateDetails.tsx
components/applications/details/ApplicationWorkflowDetails.tsx
app/(admin)/dashboard/applications/[applicationId]/page.tsx
```

The application already stores optional resume metadata:

```txt
candidateResumeKey
candidateResumeFileName
candidateResumeSize
candidateResumeContentType
```

The missing pieces are:

1. Present the cover letter and resume metadata.
2. Demonstrate that a private object's raw URL is not authorized.
3. Generate a temporary signed GET URL on the server.
4. Protect resume access with a separate admin-only route.

## Final Request Flow
```txt
Admin clicks OPEN RESUME
  -> GET /api/applications/{applicationId}/resume
  -> verify the logged-in user is an ADMIN
  -> load the application and its trusted resume key
  -> create a signed GET URL valid for five minutes
  -> redirect the browser to DigitalOcean Spaces
  -> Spaces validates the signature and returns the PDF
```

The object remains private. The application stores the durable object key; the route creates temporary permission only when an authorized admin requests it.

## Files Changed
```txt
components/applications/details/ApplicationSubmissionDetails.tsx
app/(admin)/dashboard/applications/[applicationId]/page.tsx
services/uploads/uploads.service.ts
app/api/applications/[applicationId]/resume/route.ts
```

---

## Step 1 - Create ApplicationSubmissionDetails
Create:

```txt
components/applications/details/ApplicationSubmissionDetails.tsx
```

Add:

```tsx
import { FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Application } from "@/types";

type Props = {
  application: Application;
};

function formatFileSize(size?: number) {
  if (!size) {
    return "UNKNOWN SIZE";
  }

  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

function ApplicationSubmissionDetails({ application }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>APPLICATION</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        <div>
          <p className="font-mono text-xs text-muted-foreground">
            COVER LETTER
          </p>
          <p className="mt-3 whitespace-pre-wrap font-mono text-sm leading-7">
            {application.candidateCoverLetter}
          </p>
        </div>

        <div>
          <p className="font-mono text-xs text-muted-foreground">RESUME</p>

          {application.candidateResumeKey ? (
            <div className="mt-3 flex items-center justify-between gap-4 brutal-border p-4">
              <div className="flex items-center gap-3">
                <FileText />
                <div>
                  <p className="font-heading text-sm font-bold">
                    {application.candidateResumeFileName ?? "RESUME.PDF"}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {formatFileSize(application.candidateResumeSize)}
                  </p>
                </div>
              </div>

              <span className="font-mono text-xs text-muted-foreground">
                PRIVATE FILE
              </span>
            </div>
          ) : (
            <p className="mt-3 font-mono text-sm">NO RESUME AVAILABLE</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ApplicationSubmissionDetails;
```

What to explain:

- `whitespace-pre-wrap` preserves the candidate's cover-letter paragraphs.
- The UI displays filename and size, not the storage key.
- Resume fields remain optional so legacy applications do not crash.
- `candidateResumeKey` is the durable storage identifier and the condition that proves a resume exists.

---

## Step 2 - Add Submission Details to the Page
Open:

```txt
app/(admin)/dashboard/applications/[applicationId]/page.tsx
```

Add the import:

```tsx
import ApplicationSubmissionDetails from "@/components/applications/details/ApplicationSubmissionDetails";
```

Then render it after the two-column details grid:

```tsx
<div className="mt-8 grid gap-6 lg:grid-cols-2">
  <ApplicationCandidateDetails application={application} />
  <ApplicationWorkflowDetails application={application} />
</div>

<div className="mt-6">
  <ApplicationSubmissionDetails application={application} />
</div>
```

At this point the details route shows:

```txt
candidate snapshot
workflow state
cover letter
resume filename and size
```

There is intentionally no working resume link yet.

---

## Step 3 - Reproduce the Raw Private URL `403`
Before solving secure downloads, expose the failure clearly.

Open:

```txt
components/applications/details/ApplicationSubmissionDetails.tsx
```

Update the icon import:

```tsx
import { ExternalLink, FileText } from "lucide-react";
```

Add the button import:

```tsx
import { Button } from "@/components/ui/button";
```

Inside `ApplicationSubmissionDetails`, before `return`, temporarily construct the raw object URL:

```tsx
function ApplicationSubmissionDetails({ application }: Props) {
  const publicUrl = process.env.DO_SPACES_PUBLIC_URL;

  const rawResumeUrl =
    publicUrl && application.candidateResumeKey
      ? `${publicUrl.replace(/\/$/, "")}/${application.candidateResumeKey}`
      : null;

  return (
    // existing JSX
  );
}
```

Replace the `PRIVATE FILE` label:

```tsx
<span className="font-mono text-xs text-muted-foreground">
  PRIVATE FILE
</span>
```

with the temporary raw-link button:

```tsx
{rawResumeUrl && (
  <Button asChild variant="outline" size="sm">
    <a href={rawResumeUrl} target="_blank" rel="noopener noreferrer">
      OPEN RESUME
      <ExternalLink />
    </a>
  </Button>
)}
```

Click **OPEN RESUME**. DigitalOcean Spaces should return:

```xml
<Error>
  <Code>AccessDenied</Code>
</Error>
```

The `403` is the expected result:

- CDN enablement does not automatically make every object public.
- The upload did not use `ACL: "public-read"`.
- The object key identifies a file but does not grant permission.
- Resumes contain personal information and should not be public.

Do not solve the demonstration by making the Space public. Remove this temporary raw URL after the protected route is ready.

Teaching point:

> `403 AccessDenied` proves the resume is private; it does not mean the upload failed.

---

## Step 4 - Add the Signed Download Helper
Open:

```txt
services/uploads/uploads.service.ts
```

Replace the complete file with:

```ts
import "server-only";
import { randomUUID } from "node:crypto";
import {
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { spacesBucket, spacesClient } from "@/lib/storage";
import { resumeUploadRequestSchema } from "./uploads.validation";

const SIGNED_URL_TTL_SECONDS = 5 * 60;

export async function uploadResume(file: File) {
  const validated = resumeUploadRequestSchema.parse({
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type,
  });

  const id = randomUUID();
  const key = `resumes/${id}.pdf`;
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

export async function createResumeDownloadUrl(
  key: string,
  fileName?: string,
) {
  const contentDisposition = fileName
    ? `inline; filename*=UTF-8''${encodeURIComponent(fileName)}`
    : "inline";

  return getSignedUrl(
    spacesClient,
    new GetObjectCommand({
      Bucket: spacesBucket,
      Key: key,
      ResponseContentDisposition: contentDisposition,
      ResponseContentType: "application/pdf",
    }),
    { expiresIn: SIGNED_URL_TTL_SECONDS },
  );
}
```

What to explain:

- `GetObjectCommand` requests a private object.
- `getSignedUrl()` signs that one request with server credentials.
- `expiresIn` limits the permission to five minutes.
- `inline` lets the browser display the PDF.
- The original filename is encoded safely in the response disposition.
- `server-only` prevents this service and its credentials from entering a client bundle.

Never save the signed URL in MongoDB:

```txt
candidateResumeKey -> durable identifier; store it
signed URL         -> temporary permission; generate on demand
```

---

## Step 5 - Create the Admin-Only Resume Route
Create:

```txt
app/api/applications/[applicationId]/resume/route.ts
```

Add:

```ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { getApplicationById } from "@/services/applications/applications.service";
import { createResumeDownloadUrl } from "@/services/uploads/uploads.service";

type RouteContext = {
  params: Promise<{ applicationId: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 },
    );
  }

  if (currentUser.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Admin access required" },
      { status: 403 },
    );
  }

  const { applicationId } = await params;
  const result = await getApplicationById(applicationId);

  if (!result.success || !result.data?.candidateResumeKey) {
    return NextResponse.json(
      { message: "Resume not found" },
      { status: 404 },
    );
  }

  const application = result.data;

  const downloadUrl = await createResumeDownloadUrl(
    application.candidateResumeKey,
    application.candidateResumeFileName,
  );

  return NextResponse.redirect(downloadUrl);
}
```

The route performs five separate jobs:

1. Authentication asks who is making the request.
2. Authorization checks that the user is an admin.
3. The application ID is resolved through the service.
4. The trusted resume key is read from the application.
5. The route redirects only after a signed URL is created.

Do not accept a storage key from the browser:

```txt
Bad:
/api/resume?key=anything-the-user-wants

Better:
/api/applications/{applicationId}/resume
```

The application ID names the resource being authorized. The server then resolves the storage key that belongs to that application.

Important:

> The dashboard page and API route are separate entry points. Each entry point needs its own authorization.

---

## Step 6 - Replace the Raw URL With the Protected Route
Return to:

```txt
components/applications/details/ApplicationSubmissionDetails.tsx
```

Remove the temporary raw URL:

```tsx
const publicUrl = process.env.DO_SPACES_PUBLIC_URL;

const rawResumeUrl =
  publicUrl && application.candidateResumeKey
    ? `${publicUrl.replace(/\/$/, "")}/${application.candidateResumeKey}`
    : null;
```

Replace the temporary raw-link button:

```tsx
{rawResumeUrl && (
  <Button asChild variant="outline" size="sm">
    <a href={rawResumeUrl} target="_blank" rel="noopener noreferrer">
      OPEN RESUME
      <ExternalLink />
    </a>
  </Button>
)}
```

with:

```tsx
<Button asChild variant="outline" size="sm">
  <a
    href={`/api/applications/${application.id}/resume`}
    target="_blank"
    rel="noopener noreferrer"
  >
    OPEN RESUME
    <ExternalLink />
  </a>
</Button>
```

The button is already inside the `candidateResumeKey` branch, so it is rendered only when the application has a stored resume.

The final flow is:

```txt
/api/applications/{applicationId}/resume
  -> authenticate
  -> authorize ADMIN
  -> load trusted key
  -> sign one GET request
  -> temporary redirect
  -> private PDF
```

The browser sees the temporary signed URL after the redirect, but it never receives Spaces credentials.

---

## Step 7 - Verify the Complete Lecture
### Submission details

1. Visit `/dashboard/applications/{applicationId}`.
2. Confirm the cover letter preserves line breaks.
3. Confirm the resume filename and formatted size appear.
4. Open a legacy application without `candidateResumeKey`.
5. Confirm it shows `NO RESUME AVAILABLE` without crashing.

### Raw private object behavior

1. During Step 3, click the temporary raw object link.
2. Confirm Spaces returns `403 AccessDenied`.
3. Confirm the object was uploaded and still exists.
4. Remove the raw URL code before finishing the lecture.

### Authorized resume access

1. Sign in as an admin.
2. Click **OPEN RESUME**.
3. Confirm the PDF opens in a new tab.
4. Inspect the redirected URL and identify signed query parameters.
5. Confirm the URL has a short expiration.

### Route authorization

Test the protected route directly:

```txt
/api/applications/{applicationId}/resume
```

Expected behavior:

- admin session + existing resume -> redirect and open PDF
- no session -> `401`
- candidate session -> `403`
- unknown application -> `404`
- application without a resume key -> `404`

### Regression checks

- The applications table still opens the details route.
- Candidate and workflow cards from Lecture 117 still render.
- The Space remains private.
- No storage credentials appear in browser source or network requests.
- No signed URL is stored in MongoDB.

---

## Common Mistakes
- Making the Space public to remove the `403`.
- Keeping `DO_SPACES_PUBLIC_URL` in the final resume link.
- Storing signed URLs in MongoDB.
- Signing an arbitrary storage key supplied by the browser.
- Checking the admin role only in the dashboard page.
- Forgetting that route handlers are independently reachable.
- Rendering the resume button for applications without a key.
- Assuming every old application has resume metadata.
- Sending Spaces credentials to a Client Component.

## Key points
> The application stores the object key; the server creates temporary permission.

> A private file can be displayed safely without becoming a public file.

> We authorize an application ID, then resolve its trusted storage key on the server.

> Hiding a button is UX. Checking the admin role in the route is security.

## Next
Lecture 119 tours the OpenAI Platform and creates the server-only API client. Lectures 120–121 then send the private PDF through OpenAI Files and Responses APIs without a local extraction service.
