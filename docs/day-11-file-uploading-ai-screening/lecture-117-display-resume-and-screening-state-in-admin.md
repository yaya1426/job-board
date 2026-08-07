# Lecture 117 - Application Details, Private Resume, and Screening State | تفاصيل الطلب والسيرة الذاتية الخاصة

## Goal

Turn the inactive **VIEW** action into a real application details page, display what the candidate submitted, reproduce the private resume `403`, and then let an authorized admin open the resume through a temporary signed URL.

## Problem-First Story

There are two visible problems:

1. The eye button currently points to an unrelated candidate URL.
2. Opening the resume through its CDN/object URL returns:

```txt
AccessDenied (403)
```

The `403` is not an upload failure. It proves the object is private. We need to authorize the admin without making candidate resumes public.

## Final Request Flow

```txt
Admin clicks OPEN RESUME
  -> GET /api/applications/{applicationId}/resume
  -> verify the logged-in user is an ADMIN
  -> load the application and its resume key
  -> create a signed GET URL valid for five minutes
  -> redirect the browser to DigitalOcean Spaces
  -> Spaces validates the signature and returns the PDF
```

The permanent object remains private.

## Files Changed

```txt
components/applications/ApplicationsTable.tsx
app/(admin)/dashboard/applications/[applicationId]/page.tsx
services/uploads/uploads.service.ts
app/api/applications/[applicationId]/resume/route.ts
types/Application.ts
lib/models/application.model.ts
services/applications/applications.service.ts
```

The application lookup already exists:

```txt
services/applications/applications.service.ts -> getApplicationById()
repositories/applications.repository.ts       -> findApplicationById()
```

---

## Step 1 - Fix the VIEW Action

Open:

```txt
components/applications/ApplicationsTable.tsx
```

Find the current eye-button link:

```tsx
<Link href={`/admin/candidates/${app.candidateId}`}>
  <Button variant="ghost" size="icon" title="VIEW">
    <Eye size={14} />
  </Button>
</Link>
```

Replace it with:

```tsx
<Link href={`/dashboard/applications/${app.id}`}>
  <Button variant="ghost" size="icon" title="VIEW APPLICATION">
    <Eye size={14} />
  </Button>
</Link>
```

Now clicking the eye opens:

```txt
/dashboard/applications/{applicationId}
```

Teaching point:

> The admin is reviewing a specific application snapshot, not the candidate's mutable profile.

---

## Step 2 - Build the Application Details Page

The dynamic route already exists, but it is only a placeholder:

```txt
app/(admin)/dashboard/applications/[applicationId]/page.tsx
```

Replace the complete file with:

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { getApplicationById } from "@/services/applications/applications.service";
import { AiScore, StatusBadge } from "@/components/BrutalUI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ScreeningStatus } from "@/types/ScreeningStatus";

type Props = {
  params: Promise<{ applicationId: string }>;
};

const screeningLabels: Record<ScreeningStatus, string> = {
  PENDING: "WAITING",
  PROCESSING: "SCREENING",
  COMPLETED: "READY",
  FAILED: "FAILED",
};

function formatFileSize(size?: number) {
  if (!size) {
    return "UNKNOWN SIZE";
  }

  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

async function ApplicationDetailsPage({ params }: Props) {
  const { applicationId } = await params;
  const result = await getApplicationById(applicationId);

  if (!result.success || !result.data) {
    notFound();
  }

  const application = result.data;

  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/applications">
              <ArrowLeft />
              BACK TO APPLICATIONS
            </Link>
          </Button>

          <h1 className="mt-6 font-heading text-4xl font-bold">
            {application.candidateName}
          </h1>

          <p className="mt-1 font-mono text-sm text-muted-foreground">
            Applied for {application.jobTitle} at {application.jobCompany}
          </p>
        </div>

        <div className="text-right">
          <StatusBadge status={application.status} />
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            APPLIED {application.appliedDate}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>CANDIDATE SNAPSHOT</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <p className="font-mono text-xs text-muted-foreground">NAME</p>
              <p className="mt-1 font-heading font-bold">
                {application.candidateName}
              </p>
            </div>

            <div>
              <p className="font-mono text-xs text-muted-foreground">EMAIL</p>
              <a
                href={`mailto:${application.candidateEmail}`}
                className="mt-1 inline-block font-mono text-sm underline"
              >
                {application.candidateEmail}
              </a>
            </div>

            <div>
              <p className="font-mono text-xs text-muted-foreground">
                LINKEDIN
              </p>
              <a
                href={application.candidateLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-2 font-mono text-sm underline"
              >
                OPEN PROFILE
                <ExternalLink size={14} />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WORKFLOW</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                APPLICATION STATUS
              </p>
              <div className="mt-2">
                <StatusBadge status={application.status} />
              </div>
            </div>

            <div>
              <p className="font-mono text-xs text-muted-foreground">
                SCREENING STATUS
              </p>
              <Badge variant="outline" className="mt-2">
                {screeningLabels[application.screeningStatus]}
              </Badge>
            </div>

            <div>
              <p className="font-mono text-xs text-muted-foreground">
                AI SCORE
              </p>

              {application.screeningStatus === "COMPLETED" ? (
                <div className="mt-2">
                  <AiScore score={application.aiScore} />
                </div>
              ) : (
                <p className="mt-2 font-mono text-sm">
                  NOT AVAILABLE UNTIL SCREENING COMPLETES
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
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
    </div>
  );
}

export default ApplicationDetailsPage;
```

What to explain:

- This is a Server Component, so it loads the application directly through the service.
- It uses application snapshot fields such as `candidateName` and `candidateEmail`.
- It does not replace submitted data with the candidate's current profile.
- The dashboard layout already protects this page.

At this point the resume metadata is visible, but there is no way to open the private file.

---

## Step 3 - Reproduce the `403` Problem

For the demonstration only, construct the raw object URL inside the details page.

After:

```tsx
const application = result.data;
```

temporarily add:

```tsx
const rawResumeUrl =
  process.env.DO_SPACES_PUBLIC_URL && application.candidateResumeKey
    ? `${process.env.DO_SPACES_PUBLIC_URL.replace(/\/$/, "")}/${application.candidateResumeKey}`
    : null;
```

Then replace:

```tsx
<span className="font-mono text-xs text-muted-foreground">
  PRIVATE FILE
</span>
```

with:

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

Click **OPEN RESUME**. DigitalOcean should return:

```xml
<Error>
  <Code>AccessDenied</Code>
</Error>
```

Explain why:

- CDN enablement does not automatically make every object public.
- The upload did not use `ACL: "public-read"`.
- The object key identifies the file but does not authorize access.
- Candidate resumes contain personal information, so public access is inappropriate.

Do not make the Space public. The temporary code above will be removed in Step 6.

---

## Step 4 - Add the Signed Download Service

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
- `getSignedUrl()` adds a temporary cryptographic signature.
- `expiresIn` limits access to five minutes.
- `inline` lets the browser display the PDF.
- `server-only` prevents this service and its credentials from entering a client bundle.

Do not save the generated URL in MongoDB:

```txt
candidateResumeKey -> durable, store it
signed URL         -> temporary, generate it when needed
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

What to explain:

1. Authentication asks: “Who is making this request?”
2. Authorization asks: “Is this user allowed to open resumes?”
3. The application ID is resolved on the server.
4. The browser never sends an arbitrary storage key to be signed.
5. The route redirects only after all checks pass.

Why not accept a key in the query string?

```txt
Bad:
/api/resume?key=anything-the-user-wants

Better:
/api/applications/{applicationId}/resume
```

The server loads the trusted key that belongs to that application.

Important:

> The dashboard page and the API route are separate entry points. Each entry point needs its own authorization.

---

## Step 6 - Replace the Raw URL With the Protected Route

Return to:

```txt
app/(admin)/dashboard/applications/[applicationId]/page.tsx
```

First remove the temporary variable:

```tsx
const rawResumeUrl =
  process.env.DO_SPACES_PUBLIC_URL && application.candidateResumeKey
    ? `${process.env.DO_SPACES_PUBLIC_URL.replace(/\/$/, "")}/${application.candidateResumeKey}`
    : null;
```

Then replace the temporary raw-link button:

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

The final browser flow is now:

```txt
/api/applications/{applicationId}/resume
  -> authorization
  -> signed URL
  -> temporary redirect
  -> private PDF
```

The browser receives the temporary URL, but it never receives Spaces access credentials.

---

## Step 7 - Stop Displaying a Fake AI Score

The application is created with:

```ts
aiScore: 0,
screeningStatus: "PENDING",
```

That makes the applications table show `0.0/10`, even though screening has not happened. A missing result is different from a real score of zero.

### 7.1 Make `aiScore` Optional in the Type

Open:

```txt
types/Application.ts
```

Change:

```ts
aiScore: number;
```

to:

```ts
aiScore?: number;
```

### 7.2 Make `aiScore` Optional in Mongoose

Open:

```txt
lib/models/application.model.ts
```

Change:

```ts
aiScore: { type: Number, required: true },
```

to:

```ts
aiScore: { type: Number },
```

### 7.3 Stop Saving the Placeholder Score

Open:

```txt
services/applications/applications.service.ts
```

Remove:

```ts
aiScore: 0, //TODO: Removed after AI screening is implemented
```

The creation object should now include:

```ts
const newApplication = await saveNewApplication({
  ...validated.data,
  candidateId: currentUser.id,
  candidateResumeKey: resume.key,
  candidateResumeFileName: resume.fileName,
  candidateResumeSize: resume.fileSize,
  candidateResumeContentType: resume.contentType,
  jobTitle: job.title,
  role: job.title,
  jobCompany: job.company,
  screeningStatus: "PENDING",
  status: "SUBMITTED",
});
```

### 7.4 Update the Applications Table

In:

```txt
components/applications/ApplicationsTable.tsx
```

Replace:

```tsx
<AiScore score={app.aiScore} size="sm" />
```

with:

```tsx
{app.screeningStatus === "COMPLETED" &&
app.aiScore !== undefined ? (
  <AiScore score={app.aiScore} size="sm" />
) : (
  <span className="font-mono text-xs text-muted-foreground">
    {app.screeningStatus}
  </span>
)}
```

### 7.5 Update the Details Page Score Condition

In the details page, replace:

```tsx
{application.screeningStatus === "COMPLETED" ? (
  <div className="mt-2">
    <AiScore score={application.aiScore} />
  </div>
) : (
  <p className="mt-2 font-mono text-sm">
    NOT AVAILABLE UNTIL SCREENING COMPLETES
  </p>
)}
```

with:

```tsx
{application.screeningStatus === "COMPLETED" &&
application.aiScore !== undefined ? (
  <div className="mt-2">
    <AiScore score={application.aiScore} />
  </div>
) : (
  <p className="mt-2 font-mono text-sm">
    NOT AVAILABLE UNTIL SCREENING COMPLETES
  </p>
)}
```

Now the UI communicates the truth:

```txt
PENDING    -> no score yet
PROCESSING -> no score yet
COMPLETED  -> show the real score
FAILED     -> no score available
```

Existing applications that already contain the temporary value `0` will still hide it unless their screening status is `COMPLETED`.

---

## Step 8 - Verify the Complete Lesson

### Application navigation

1. Visit `/dashboard/applications`.
2. Click the eye icon.
3. Confirm the URL is:

```txt
/dashboard/applications/{applicationId}
```

4. Confirm the page shows:
   - candidate name
   - candidate email
   - LinkedIn URL
   - job title and company
   - applied date
   - cover letter
   - resume filename and size
   - application status
   - screening status

### Private resume behavior

1. Open the raw CDN/object URL.
2. Confirm it returns `403 AccessDenied`.
3. Click **OPEN RESUME** from the application details page.
4. Confirm the PDF opens in a new tab.
5. Inspect the redirected URL and identify the signed query parameters.
6. Confirm the signed URL expires after five minutes.

### Authorization

1. Open the protected route while logged in as an admin.
2. Confirm the resume opens.
3. Open it without a session and confirm `401`.
4. Open it as a candidate and confirm `403`.
5. Confirm an application without `candidateResumeKey` returns `404`.

### Screening state

1. Confirm a `PENDING` application does not show `0.0/10`.
2. Confirm it shows `PENDING` or `WAITING`.
3. Confirm the details page says the score is not available yet.

---

## Common Mistakes

- Making the Space public to remove the `403`.
- Keeping the raw CDN URL in the final UI.
- Storing signed URLs in MongoDB.
- Signing a storage key supplied directly by the browser.
- Checking the admin role only in the page.
- Linking the eye icon to the candidate instead of the application.
- Replacing snapshot fields with current profile data.
- Showing `0` before screening has run.
- Forgetting to handle old applications that have no resume key.

## Key Teaching Lines

> The application details page shows what the candidate submitted at that moment.

> `403 AccessDenied` proves the resume is private; it is not evidence that the upload failed.

> The object key is permanent. The signed URL is temporary permission.

> We authorize an application ID, then the server resolves its trusted object key.

> A score of zero and a score that does not exist are two different states.

## Next

Lecture 118 reads the same private PDF from Spaces on the server and extracts its text for automated screening.
