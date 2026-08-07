# Lecture 116 - Pending and Post-Apply State | حالة التقييم بعد التقديم

## Goal

Make the job page honest after submission:

1. Every new application starts as `screeningStatus: "PENDING"`.
2. A candidate who already applied sees a submitted state instead of the apply form.
3. The hard-coded public `7.8` AI score disappears until real screening results exist.

## Explain It Simply (For Beginners)

The application needs a separate field that tracks where the AI review is:

```txt
PENDING -> PROCESSING -> COMPLETED
                     -> FAILED
```

A brand-new application is `PENDING`: it has been saved, but no worker has claimed it yet.

We're not building the worker or AI yet. The page should say only what is true: the application exists and screening is waiting.

The `YOUR AI MATCH SCORE: 7.8` box in the screenshot is hard-coded inside `JobDescription`; it is not the application's `aiScore`. Remove that mock now. Real AI results appear later in the authorized admin application UI.

### Why `aiScore: 0` is removed in Lecture 117, not here

The current dashboard, application table, candidate list, and statistics all assume `aiScore` is always a number. Making it optional here would break several screens at once.

Keep `aiScore: 0` for this one transitional lesson. `screeningStatus` is now the source of truth: `PENDING` means the zero is **not a real score**. Lecture 117 updates the UI to understand pending applications and removes the fake score safely.

### Jargon decoder

- **Enum** = a field allowed to be only one of a fixed set of values (here, the four statuses).
- **Default value** = what the database uses when we don't set the field (here, `PENDING`).
- **Transitional state** = a short-lived intermediate version that keeps the app compiling while the next lesson updates dependent UI.



## Files Updated

```txt
types/Application.ts
lib/models/application.model.ts
services/applications/applications.service.ts
repositories/applications.repository.ts
app/actions/applications/applications.action.ts
app/(client)/jobs/[id]/page.tsx
components/jobs/ApplicationSubmitted.tsx
components/jobs/JobDescription.tsx
```

The type, model, and service add honest screening state. The repository and UI files create the post-apply page behavior and remove the fake public score.

## Step 1 - Update `types/Application.ts`

Add a reusable status type above the interface:

```ts
export type ScreeningStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";
```

Then add `screeningStatus` beside `aiScore`:

```ts
export interface Application {
  // ...existing candidate/job fields

  aiScore: number; // removed safely in Lecture 117
  screeningStatus: ScreeningStatus;
  status: "SUBMITTED" | "REVIEW" | "SHORTLIST" | "INTERVIEW" | "REJECTED";

  // ...existing date/cover-letter fields
}
```

Do not add `aiSummary`, `aiStrengths`, `aiRisks`, or failure fields yet. Introduce those only when the AI/result lessons need them.

## Step 2 - Update `lib/models/application.model.ts`

Add the screening field immediately after `aiScore`:

```ts
aiScore: { type: Number, required: true },
screeningStatus: {
  type: String,
  enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
  default: "PENDING",
  required: true,
},
status: {
  type: String,
  enum: ["SUBMITTED", "REVIEW", "SHORTLIST", "INTERVIEW", "REJECTED"],
  required: true,
},
```

Why both `default` and `required`?

- `default: "PENDING"` gives new documents a safe starting value.
- `required: true` prevents a new application from intentionally storing no screening state.

Keep `status` and `screeningStatus` separate:

```txt
status          -> hiring workflow (SUBMITTED, REVIEW, INTERVIEW...)
screeningStatus -> AI workflow (PENDING, PROCESSING, COMPLETED, FAILED)
```



## Step 3 - Update `services/applications/applications.service.ts`

Starting from the final `applyToJob` code in Lecture 115, add one property to `saveNewApplication`:

```ts
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
  aiScore: 0, // transitional; removed in Lecture 117
  screeningStatus: "PENDING",
  status: "SUBMITTED",
});
```

We set the value explicitly in the service even though Mongoose has a default. This makes the business rule visible:

> Every submitted application enters the screening workflow as `PENDING`.

The database default is defense in depth if another code path creates an application later.

## Step 4 - Add a Focused Repository Query

The page needs to answer one question:

> Does this logged-in candidate already have an application for this job?

Add this focused method to `repositories/applications.repository.ts`:

```ts
export async function findApplicationByCandidateAndJob(
  candidateId: string,
  jobId: string,
): Promise<Application | null> {
  await dbConnect();

  const application = await ApplicationModel.findOne({
    candidateId: new ObjectId(candidateId),
    jobId: new ObjectId(jobId),
  }).lean<ApplicationLean>();

  return application ? toApplication(application) : null;
}
```

This query is better than loading every application and filtering in JavaScript. MongoDB answers the exact relationship question.

## Step 5 - Protect Against Duplicate Applications in the Service

Hiding the form is only UX. A user could still call the Server Action directly, so the service must enforce the same rule.

Add the repository import in `services/applications/applications.service.ts`:

```ts
import {
  findAllApplications,
  findApplicationByCandidateAndJob,
  findApplicationById,
  saveNewApplication,
} from "@/repositories/applications.repository";
```

Inside `applyToJob`, after authentication and job lookup—but **before** `uploadResume`—add:

```ts
const existingApplication = await findApplicationByCandidateAndJob(
  currentUser.id,
  validated.data.jobId,
);

if (existingApplication) {
  return {
    success: false,
    errors: {
      application: ["You have already applied to this job"],
    },
  };
}
```

The check must happen before upload; otherwise a duplicate attempt can leave an unnecessary file in Spaces.

Then add a read use case for the server page:

```ts
export async function getCurrentUserApplicationForJob(
  jobId: string,
): Promise<ServiceResult<Application | null>> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      errors: { auth: ["You must be logged in"] },
    };
  }

  const application = await findApplicationByCandidateAndJob(
    currentUser.id,
    jobId,
  );

  return { success: true, data: application };
}
```

Both the mutation and page now use the same repository query.

## Step 6 - Revalidate the Job Page After Applying

After a successful Server Action, Next.js must render the job page again so it can replace the form with the submitted state.

Update `app/actions/applications/applications.action.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { applyToJob } from "@/services/applications/applications.service";

// ...ApplyToJobState stays unchanged

export async function handleApplyToJob(
  _prevState: ApplyToJobState,
  formData: FormData,
): Promise<ApplyToJobState> {
  const input = Object.fromEntries(formData);
  const result = await applyToJob(input);

  if (!result.success) {
    return { errors: result.errors };
  }

  const jobId = String(formData.get("jobId") ?? "");
  revalidatePath(`/jobs/${jobId}`);
}
```

`revalidatePath` does not provide security. It only refreshes server-rendered data after the mutation.

## Step 7 - Create the Submitted State Component

Create `components/jobs/ApplicationSubmitted.tsx`:

```tsx
function ApplicationSubmitted() {
  return (
    <aside className="brutal-border lg:border-l-0 p-8">
      <h3 className="font-heading text-xl font-bold border-b-3 border-foreground pb-4">
        APPLICATION SUBMITTED
      </h3>

      <div className="mt-6 bg-accent/10 brutal-border p-5">
        <p className="font-heading font-bold">WE RECEIVED YOUR APPLICATION</p>
        <p className="font-mono text-xs text-muted-foreground mt-2">
          Your resume is stored securely. Screening is waiting to begin.
        </p>
      </div>

      <p className="font-mono text-xs mt-5">
        SCREENING STATUS: <strong>PENDING</strong>
      </p>
    </aside>
  );
}

export default ApplicationSubmitted;
```

This component does not claim the AI has completed anything. It shows only the state we actually have.

## Step 8 - Render Form or Submitted State

Update `app/(client)/jobs/[id]/page.tsx`.

Add imports:

```ts
import ApplicationSubmitted from "@/components/jobs/ApplicationSubmitted";
import { getCurrentUserApplicationForJob } from "@/services/applications/applications.service";
```

After confirming `userProfileResult` succeeded, load the relationship:

```ts
const applicationResult = await getCurrentUserApplicationForJob(id);
const hasApplied =
  applicationResult.success && Boolean(applicationResult.data);
```

Then replace the unconditional form:

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-0 mt-6">
  <JobDescription job={job} />
  {hasApplied ? (
    <ApplicationSubmitted />
  ) : (
    <JobApplyForm userProfile={userProfile} />
  )}
</div>
```

The page is a Server Component, so this relationship check stays server-side and does not expose candidate identity to the browser.

## Step 9 - Remove the Fake Public AI Score

In `components/jobs/JobDescription.tsx`:

1. Remove the unused `Card` import.
2. Delete the entire hard-coded block containing:

```tsx
<span className="font-heading text-3xl font-bold text-accent">
  7.8
</span>
```

Do not condition this hard-coded value on `PENDING`; remove it. `JobDescription` has no real application screening result, and displaying invented AI data is misleading.

Later lessons render the **real** score from a completed application in the authorized admin UI:

```txt
PENDING / PROCESSING -> status only, no score
COMPLETED            -> show real aiScore + explanation
FAILED               -> failure state, no score
```



## Final State After This Lesson

```txt
Candidate submits application
  -> resume is uploaded
  -> application is saved
  -> status = SUBMITTED
  -> screeningStatus = PENDING
  -> job page re-renders
  -> apply form becomes APPLICATION SUBMITTED
  -> fake public AI score is gone
  -> no worker runs yet
```



## Verification

1. Run:

```bash
npx tsc --noEmit
npm run lint
```

2. Submit a new application.
3. Open its MongoDB document and verify:

```json
{
  "status": "SUBMITTED",
  "screeningStatus": "PENDING",
  "aiScore": 0
}
```

4. Explain clearly that `aiScore: 0` is temporary compatibility data, **not** an AI result.
5. Return to the submitted job page:
   - the apply form is gone
   - `APPLICATION SUBMITTED` is visible
   - the status says `PENDING`
6. Refresh the page and confirm the submitted state remains (it comes from MongoDB, not temporary client state).
7. Try calling the action again and confirm the service rejects the duplicate.
8. Confirm the hard-coded `7.8` score no longer appears.
9. Confirm existing application/admin pages still render.



## Common Mistakes

- Replacing the existing hiring `status` field with `screeningStatus`. They represent different workflows.
- Using lowercase values such as `"pending"` while the enum expects `"PENDING"`.
- Adding future AI result/error fields before a lesson needs them.
- Removing `aiScore` here without updating every component that assumes it is a number.
- Hiding the form without also rejecting duplicates in the service.
- Checking for duplicates after uploading the resume instead of before.
- Using client state alone to remember submission; it disappears on refresh.
- Showing the hard-coded `7.8` because it “looks finished.”



## Key Teaching Lines

> Application status and screening status are two separate workflows.

> Async work needs a status field from day one, even before the async work exists.

> Change the data contract in small, runnable steps; remove the fake score when the UI is ready to handle its absence.



## Next

Lecture 117 lets admins open the private resume, displays the screening state, and safely removes the stored fake `aiScore: 0`.