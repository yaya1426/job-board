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
services/applications/applications.validation.ts
app/actions/applications/applications.action.ts
services/applications/applications.service.ts
components/jobs/JobApplyForm.tsx
```

Change the files in this order so each layer's contract is ready before the next layer uses it.

## Step 1 - Final `next.config.ts`

The PDF travels inside the Server Action request. Next.js limits Server Action bodies to 1 MB by default, so use 6 MB: 5 MB for the PDF plus multipart/form fields overhead.

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
```

Restart the development server after changing `next.config.ts`.

## Step 2 - Final `services/applications/applications.validation.ts`

Add `resume` to the existing application form schema. This rule only checks that a non-empty `File` arrived. `uploadResume` remains responsible for the authoritative PDF type and 5 MB checks.

```ts
import { z } from "zod";

export const applyToJobSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  candidateName: z.string().min(1, "Candidate Name is required"),
  candidateEmail: z.email({ error: "Invalid email address" }),
  candidateLinkedin: z.url({ error: "Invalid LinkedIn URL" }),
  candidateCoverLetter: z
    .string()
    .min(1, "Candidate Cover Letter is required"),
  resume: z
    .instanceof(File, { error: "Resume is required" })
    .refine((file) => file.size > 0, "Resume is required"),
});

export type ApplyToJobInput = z.infer<typeof applyToJobSchema>;
```

Why validate twice?

- This schema answers: “Did the form send a real file?”
- `resumeUploadRequestSchema` answers: “Is it a PDF and no larger than 5 MB?”

## Step 3 - Final `app/actions/applications/applications.action.ts`

The action stays thin. `Object.fromEntries(formData)` includes the uploaded `File`, so pass the raw object to the service for validation.

```ts
"use server";

import { applyToJob } from "@/services/applications/applications.service";

export type ApplyToJobState =
  | {
      errors?: Record<string, string[]>;
    }
  | undefined;

export async function handleApplyToJob(
  _prevState: ApplyToJobState,
  formData: FormData,
): Promise<ApplyToJobState> {
  const input = Object.fromEntries(formData);
  const result = await applyToJob(input);

  if (!result.success) {
    return { errors: result.errors };
  }
}
```

Do not cast the raw form object to `ApplyToJobInput`. It is untrusted until the service's zod schema validates it.

## Step 4 - Final `services/applications/applications.service.ts`

This service orchestrates the whole server-side flow:

```txt
validate form
  -> authenticate candidate
  -> load job
  -> upload resume
  -> save application + resume snapshot
```

Use this complete file:

```ts
import type { Application, ServiceResult } from "@/types";
import {
  findAllApplications,
  findApplicationById,
  saveNewApplication,
} from "@/repositories/applications.repository";
import { findJobById } from "@/repositories/jobs.repository";
import { applyToJobSchema } from "./applications.validation";
import { getCurrentUser } from "@/lib/current-user";
import { uploadResume } from "@/services/uploads/uploads.service";
import { z } from "zod";

export async function applyToJob(
  input: unknown,
): Promise<ServiceResult<Application>> {
  const validated = applyToJobSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      errors: { auth: ["You must be logged in to apply"] },
    };
  }

  const job = await findJobById(validated.data.jobId);

  if (!job) {
    return {
      success: false,
      errors: { jobId: ["Job not found"] },
    };
  }

  // TODO: check if job is active
  // TODO: check if candidate already applied to this job

  const { resume, ...applicationData } = validated.data;
  let uploadedResume;

  try {
    uploadedResume = await uploadResume(resume);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: {
          resume: error.issues.map((issue) => issue.message),
        },
      };
    }

    return {
      success: false,
      errors: {
        resume: ["Resume upload failed. Please try again."],
      },
    };
  }

  const newApplication = await saveNewApplication({
    ...applicationData,
    candidateId: currentUser.id,
    candidateResumeKey: uploadedResume.key,
    candidateResumeFileName: uploadedResume.fileName,
    candidateResumeSize: uploadedResume.fileSize,
    candidateResumeContentType: uploadedResume.contentType,
    jobTitle: job.title,
    jobCompany: job.company,
    role: job.title,
    aiScore: 0,
    status: "SUBMITTED",
  });

  return { success: true, data: newApplication };
}

export async function getApplications(): Promise<
  ServiceResult<Application[]>
> {
  const applications = await findAllApplications();

  if (!applications) {
    return {
      success: false,
      errors: { applications: ["Applications not found"] },
    };
  }

  return { success: true, data: applications };
}

export async function getApplicationById(
  id: string,
): Promise<ServiceResult<Application>> {
  const application = await findApplicationById(id);

  if (!application) {
    return {
      success: false,
      errors: { id: ["Application not found"] },
    };
  }

  return { success: true, data: application };
}
```

Important details:

- Authentication happens **before** upload, so guests cannot store files.
- Upload validation errors are mapped to `errors.resume`, which the form displays.
- The `File` itself is removed before saving. MongoDB receives only the returned metadata.
- `aiScore: 0` remains temporarily so existing score-based UI keeps compiling. Lecture 116 introduces `PENDING`; Lecture 117 removes the fake score when it updates the UI.

## Step 5 - Final `components/jobs/JobApplyForm.tsx`

Replace the fake resume area with a real file input and render `resume`/`auth` errors. Keep the existing `useActionState` flow:

> Recording note: use the plain native input here so learners can focus on the upload pipeline. Tell them we will return to the original dashed mockup in Lecture 127 and make clicking + drag-and-drop functional after the backend is complete.

```tsx
"use client";

import { useActionState } from "react";
import { useParams } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { TextArea } from "../ui/textarea";
import {
  handleApplyToJob,
  type ApplyToJobState,
} from "@/app/actions/applications/applications.action";
import type { UserProfile } from "@/types/UserProfile";
import type { User } from "@/types/User";

type Props = {
  userProfile: UserProfile & User;
};

function JobApplyForm({ userProfile }: Props) {
  const { id: jobId } = useParams<{ id: string }>();

  const [state, formAction, isPending] = useActionState<
    ApplyToJobState,
    FormData
  >(handleApplyToJob, undefined);

  return (
    <form action={formAction} className="brutal-border lg:border-l-0 p-8">
      <h3 className="font-heading text-xl font-bold mb-6 border-b-3 border-foreground pb-4">
        APPLY NOW
      </h3>

      <div className="space-y-4">
        <Input type="hidden" name="jobId" value={jobId} />

        <Input
          name="candidateName"
          label="FULL NAME"
          placeholder="YOUR NAME"
          error={state?.errors?.candidateName?.[0]}
          defaultValue={userProfile.name}
        />

        <Input
          name="candidateEmail"
          label="EMAIL"
          placeholder="YOUR@EMAIL.COM"
          error={state?.errors?.candidateEmail?.[0]}
          defaultValue={userProfile.email}
        />

        <Input
          name="candidateLinkedin"
          label="LINKEDIN"
          placeholder="LINKEDIN.COM/IN/..."
          defaultValue={userProfile.linkedin}
          error={state?.errors?.candidateLinkedin?.[0]}
        />

        <div>
          <label
            htmlFor="resume"
            className="font-heading text-xs font-bold uppercase block mb-2"
          >
            RESUME
          </label>
          <input
            id="resume"
            type="file"
            name="resume"
            accept="application/pdf,.pdf"
            required
            className="brutal-border w-full p-3 font-mono text-sm"
          />
          {state?.errors?.resume?.[0] && (
            <p className="font-mono text-xs text-destructive mt-1">
              {state.errors.resume[0]}
            </p>
          )}
        </div>

        <div>
          <label className="font-heading text-xs font-bold uppercase block mb-2">
            COVER NOTE
          </label>
          <TextArea
            name="candidateCoverLetter"
            placeholder="WHY THIS ROLE?"
            error={state?.errors?.candidateCoverLetter?.[0]}
          />
        </div>

        {state?.errors?.auth?.[0] && (
          <p className="font-mono text-xs text-destructive">
            {state.errors.auth[0]}
          </p>
        )}

        <Button
          type="submit"
          variant="accent"
          className="w-full mt-4"
          disabled={isPending}
        >
          {isPending ? "SUBMITTING..." : "SUBMIT APPLICATION →"}
        </Button>
      </div>
    </form>
  );
}

export default JobApplyForm;
```

React 19's `useActionState` directly returns `isPending`; no `useFormStatus` or custom pending state is needed.

## Step 6 - Understand the Remaining Trade-off

Upload and database save happen during one Server Action, which keeps the browser flow simple. They are still two external operations:

```txt
Spaces upload succeeds
  -> MongoDB save might fail
  -> an unreferenced/orphan PDF can remain
```

Cleanup is future hardening. Do not hide this production trade-off from learners.

## Verification

1. Restart the development server after changing `next.config.ts`.
2. Submit without a file: browser `required` blocks submission.
3. Bypass/change the browser filter and select a non-PDF: `errors.resume` appears.
4. Select a PDF larger than 5 MB: `errors.resume` appears.
5. Submit a valid PDF:
   - the object appears under `resumes/` in the private Space
   - MongoDB stores the key, original filename, size, and content type
   - MongoDB does **not** store the PDF bytes
6. Confirm no Spaces access key or secret appears in browser network responses.
7. Run:

```bash
npx tsc --noEmit
npm run lint
```

## Final Request Flow

```txt
JobApplyForm
  -> FormData (text fields + File)
  -> handleApplyToJob
  -> applyToJob
  -> uploadResume
  -> DigitalOcean Spaces
  -> saveNewApplication
  -> MongoDB
```

## Common Mistakes

- Forgetting `name="resume"` means the file never enters `FormData`.
- Forgetting the 6 MB action limit causes Next.js to reject valid large PDFs.
- Calling `uploadResume` before authentication lets guests consume storage.
- Saving `validated.data` directly tries to include the `File` in MongoDB.
- Returning upload errors under `fileSize`/`contentType` means the form never displays them; map them to `resume`.
- Adding `unique: true` to an optional resume key can break legacy documents without that field.

> The file is just another form field; the server validates, uploads, and saves it in one request.

> Store the object key, not a public URL — downloads are signed on demand.

> Keeping the single-request Server Action means one place to reason about success and failure.

## Next

Lecture 116 introduces `screeningStatus: PENDING` while keeping the current UI runnable.
