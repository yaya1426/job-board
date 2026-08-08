# Lesson 07 - Screening Status UX Under Background Processing

## Goal

Update copy and controls now that application submission returns before screening finishes.

## Step 1 - Pass the Saved Application to Candidate UI

In `app/(client)/jobs/[id]/page.tsx`, keep the existing application query and pass the result:

```tsx
const application =
  applicationResult.success ? applicationResult.data : null;

// ...

{application ? (
  <ApplicationSubmitted application={application} />
) : (
  <JobApplyForm userProfile={userProfile} />
)}
```

Replace `components/jobs/ApplicationSubmitted.tsx` with:

```tsx
import Link from "next/link";
import type { Application } from "@/types";

type Props = {
  application: Application;
};

function ApplicationSubmitted({ application }: Props) {
  return (
    <aside className="brutal-border lg:border-l-0 p-8">
      <h3 className="font-heading text-xl font-bold border-b-3 border-foreground pb-4">
        APPLICATION SUBMITTED
      </h3>

      <div className="mt-6 bg-accent/10 brutal-border p-5">
        <p className="font-heading font-bold">
          WE RECEIVED YOUR APPLICATION
        </p>
        <p className="font-mono text-xs text-muted-foreground mt-2">
          Your resume is stored securely. Screening happens in the
          background and does not affect whether we received your
          application.
        </p>
      </div>

      <p className="font-mono text-xs mt-5">
        SCREENING STATUS:{" "}
        <strong>{application.screeningStatus}</strong>
      </p>

      {application.screeningStatus === "FAILED" && (
        <p className="font-mono text-xs text-muted-foreground mt-3">
          Your application is still submitted. The hiring team can
          review it manually.
        </p>
      )}

      {(application.screeningStatus === "PENDING" ||
        application.screeningStatus === "PROCESSING") && (
        <Link
          href={`/jobs/${application.jobId}`}
          className="inline-block mt-4 font-mono text-xs underline"
        >
          REFRESH STATUS
        </Link>
      )}
    </aside>
  );
}

export default ApplicationSubmitted;
```

Do not show candidates provider errors, retry counts, or instructions to resubmit.

## Step 2 - Keep Admin Status Honest

Reuse Day 11's applications table and workflow details:

```txt
PENDING     -> waiting for background processing
PROCESSING  -> worker claimed the application
COMPLETED   -> show result and screenedAt
FAILED      -> show safe failure state; manual review remains possible
```

The pages are already dynamic. Admins can refresh the table/details page to see transitions. Real-time polling is optional product polish, not required to prove the durable architecture.

Update the Day 11 `PENDING`/`PROCESSING` copy to mention background processing:

```tsx
{application.screeningStatus === "PENDING" && (
  <p className="font-mono text-sm">
    WAITING FOR BACKGROUND SCREENING.
  </p>
)}

{application.screeningStatus === "PROCESSING" && (
  <p className="font-mono text-sm">
    BACKGROUND SCREENING IS IN PROGRESS.
  </p>
)}
```

## Step 3 - Add an Optional Admin Retry Action

Retry is appropriate only for a `FAILED` application and must remain admin-protected.

Add a repository transition:

```ts
export async function resetFailedApplicationForScreening(
  applicationId: string,
): Promise<Application | null> {
  await dbConnect();

  if (!ObjectId.isValid(applicationId)) return null;

  const application = await ApplicationModel.findOneAndUpdate(
    {
      _id: new ObjectId(applicationId),
      screeningStatus: "FAILED",
    },
    {
      $set: { screeningStatus: "PENDING" },
      $unset: {
        screeningError: 1,
        screeningStartedAt: 1,
      },
    },
    { new: true },
  ).lean<ApplicationLean>();

  return application ? toApplication(application) : null;
}
```

Create `app/actions/applications/retry-screening.action.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";
import { resetFailedApplicationForScreening } from "@/repositories/applications.repository";
import { publishScreeningJob } from "@/services/screening/screening-jobs.service";

export async function retryApplicationScreening(
  applicationId: string,
): Promise<void> {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    throw new Error("Admin access required");
  }

  const application =
    await resetFailedApplicationForScreening(applicationId);

  if (!application) {
    return;
  }

  try {
    await publishScreeningJob({ applicationId });
  } catch (error) {
    console.error("Failed to publish admin screening retry", {
      applicationId,
      message: error instanceof Error ? error.message : "Unknown error",
    });

    // Keep PENDING; reconciliation can publish it later.
  }

  revalidatePath(`/dashboard/applications/${applicationId}`);
  revalidatePath("/dashboard/applications");
}
```

Render a retry form only in the `FAILED` branch of the admin details component:

```tsx
{application.screeningStatus === "FAILED" && (
  <form
    action={retryApplicationScreening.bind(null, application.id)}
  >
    <Button type="submit" variant="outline">
      RETRY SCREENING
    </Button>
  </form>
)}
```

The action repeats authorization even though the page is protected. Server Actions are independently callable.

## Step 4 - Verify UX

```txt
candidate submit       -> response returns before OpenAI result
candidate PENDING      -> submitted confirmation + background copy
candidate PROCESSING   -> application remains submitted
candidate FAILED       -> no provider error and no resubmit prompt
admin PENDING/PROCESSING -> honest status, no score
admin COMPLETED        -> result fields
admin FAILED           -> safe error + optional retry
non-admin retry call   -> rejected
double retry click     -> only one FAILED -> PENDING transition wins
```

Run:

```bash
npx tsc --noEmit
npm run lint
```

## Next

Lesson 08 runs the complete branch, deployment, and failure-recovery test matrix.
