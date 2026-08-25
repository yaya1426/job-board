# Lesson 06 - Retries and Failure Recovery

## Goal

Retry temporary failures, stop retrying permanent failures, recover stale `PROCESSING` records, republish old `PENDING` records, and preserve Lecture 120's one-hour automatic expiration for every temporary OpenAI file.

## Implementation Status

**Planned — not in codebase** (QStash worker, atomic claims, async screening UX)

## Step 1 - Track When Processing Started

Add optional `screeningStartedAt?: string` to `Application`, add `screeningStartedAt: { type: Date }` to the Mongoose schema, and map it from `Date` to ISO string exactly like `screenedAt`.

Update the atomic claim:

```ts
$set: {
  screeningStatus: "PROCESSING",
  screeningStartedAt: new Date(),
},
```

Completed and failed writes should `$unset: { screeningStartedAt: 1 }`.

## Step 2 - Add Transition-Safe Recovery Writes

Add to `repositories/applications.repository.ts`:

```ts
export async function releaseApplicationScreeningForRetry(
  applicationId: string,
): Promise<boolean> {
  await dbConnect();

  const result = await ApplicationModel.updateOne(
    {
      _id: new ObjectId(applicationId),
      screeningStatus: "PROCESSING",
    },
    {
      $set: { screeningStatus: "PENDING" },
      $unset: { screeningStartedAt: 1 },
    },
  );

  return result.modifiedCount === 1;
}

export async function failProcessingApplication(
  applicationId: string,
  safeMessage: string,
): Promise<boolean> {
  await dbConnect();

  const result = await ApplicationModel.updateOne(
    {
      _id: new ObjectId(applicationId),
      screeningStatus: "PROCESSING",
    },
    {
      $set: {
        screeningStatus: "FAILED",
        screeningError: safeMessage,
      },
      $unset: {
        screeningStartedAt: 1,
        aiScore: 1,
        aiSummary: 1,
        aiStrengths: 1,
        aiRisks: 1,
        screenedAt: 1,
      },
    },
  );

  return result.modifiedCount === 1;
}
```

Filtering on `PROCESSING` prevents a late failure from overwriting a completed result.

## Step 3 - Classify Failures

Create `services/screening/screening-errors.ts`:

```ts
export class PermanentScreeningError extends Error {}

function getStatus(error: unknown): number | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }
}

export function isRetryableScreeningError(error: unknown): boolean {
  const status = getStatus(error);

  if (status !== undefined) {
    return status === 408 || status === 409 || status === 429 || status >= 500;
  }

  return (
    error instanceof TypeError ||
    !(error instanceof PermanentScreeningError)
  );
}
```

Classification policy:

```txt
retryable: timeout, network interruption, 408, 409, 429, provider 5xx
permanent: missing application data, missing resume, missing job, invalid PDF
```

Unknown failures are retryable first because a transient SDK/network error may not expose an HTTP status. Monitor and refine this policy from real evidence.

## Step 4 - Update the Processing Service

Wrap the Lesson 05 service:

```ts
import {
  claimPendingApplicationForScreening,
  failProcessingApplication,
  releaseApplicationScreeningForRetry,
  updateApplicationScreening,
} from "@/repositories/applications.repository";
import { findJobById } from "@/repositories/jobs.repository";
import { analyzeApplicationResume } from "./openai-screening.service";
import {
  isRetryableScreeningError,
  PermanentScreeningError,
} from "./screening-errors";

const SAFE_FAILURE_MESSAGE =
  "Screening could not be completed. Review the application manually.";

export async function processScreeningJob(
  applicationId: string,
): Promise<void> {
  const application =
    await claimPendingApplicationForScreening(applicationId);

  if (!application) return;

  try {
    if (!application.candidateResumeKey) {
      throw new PermanentScreeningError("Application has no resume");
    }

    const job = await findJobById(application.jobId);

    if (!job) {
      throw new PermanentScreeningError("Application job was not found");
    }

    const result = await analyzeApplicationResume({
      application,
      job,
    });

    await updateApplicationScreening(application.id, {
      screeningStatus: "COMPLETED",
      aiScore: result.score,
      aiSummary: result.summary,
      aiStrengths: result.strengths,
      aiRisks: result.risks,
      screenedAt: new Date(),
    });
  } catch (error) {
    if (isRetryableScreeningError(error)) {
      await releaseApplicationScreeningForRetry(application.id);
      throw error; // non-2xx delivery lets QStash retry
    }

    await failProcessingApplication(
      application.id,
      SAFE_FAILURE_MESSAGE,
    );

    console.error("Permanent screening failure", {
      applicationId: application.id,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
```

Permanent failures return normally so QStash receives success and stops redelivery. Retryable failures return the record to `PENDING` and throw so QStash retries.

Every attempt uploads through Lecture 120's helper, so each temporary file receives a one-hour `expires_after`. If an attempt fails after upload, that file may remain available until automatic expiration. The temporary file ID is not persisted.

## Step 5 - Recover Stale States

Add repository functions:

```ts
export async function resetStaleProcessingApplications(
  cutoff: Date,
): Promise<number> {
  await dbConnect();

  const result = await ApplicationModel.updateMany(
    {
      screeningStatus: "PROCESSING",
      screeningStartedAt: { $lt: cutoff },
    },
    {
      $set: { screeningStatus: "PENDING" },
      $unset: { screeningStartedAt: 1 },
    },
  );

  return result.modifiedCount;
}

export async function findOldPendingApplications(
  cutoff: Date,
): Promise<Application[]> {
  await dbConnect();

  const applications = await ApplicationModel.find({
    screeningStatus: "PENDING",
    appliedDate: { $lt: cutoff },
  }).lean<ApplicationLean[]>();

  return applications.map(toApplication);
}
```

Create `services/screening/screening-reconciliation.service.ts`:

```ts
import "server-only";
import {
  findOldPendingApplications,
  resetStaleProcessingApplications,
} from "@/repositories/applications.repository";
import { publishScreeningJob } from "./screening-jobs.service";

const STALE_AFTER_MS = 15 * 60 * 1000;

export async function reconcileScreeningJobs() {
  const cutoff = new Date(Date.now() - STALE_AFTER_MS);
  const resetCount = await resetStaleProcessingApplications(cutoff);
  const pending = await findOldPendingApplications(cutoff);

  const results = await Promise.allSettled(
    pending.map((application) =>
      publishScreeningJob({ applicationId: application.id }),
    ),
  );

  return {
    resetCount,
    republishedCount: results.filter(
      (result) => result.status === "fulfilled",
    ).length,
    publishFailureCount: results.filter(
      (result) => result.status === "rejected",
    ).length,
  };
}
```

Run this from a protected scheduled route or platform job. If using a route, require a dedicated server-only bearer secret and configure the scheduler to send it; never expose an unauthenticated repair endpoint.

Because the claim is atomic, republishing an old `PENDING` ID is safe even if an original delivery is merely delayed.

## Step 6 - Verify Failure Paths

```txt
controlled 429       -> PROCESSING -> PENDING -> QStash retry
controlled 500       -> PROCESSING -> PENDING -> QStash retry
missing resume       -> FAILED with safe message, no retry
missing job          -> FAILED with safe message, no retry
worker crash         -> stale PROCESSING reset to PENDING
publish gap          -> old PENDING republished
duplicate republish  -> only one atomic claim wins
OpenAI file created  -> expires automatically one hour after creation
```

Run:

```bash
npx tsc --noEmit
npm run lint
```

## Design Caveat

Age-based reconciliation closes the most visible gaps but is not a transactional outbox. A future outbox can make database persistence and dispatch intent part of one MongoDB transaction.

## Next

Lesson 07 updates candidate and admin UX for genuinely asynchronous background processing.
