# Lesson 05 - Idempotent Worker and Atomic Claim

## Goal

Make duplicate/redelivered jobs safe. Only one delivery may move an application from `PENDING` to `PROCESSING`; every later delivery becomes a no-op.

## Why a Read-Then-Write Check Is Unsafe

This is racy:

```txt
delivery A reads PENDING
delivery B reads PENDING
delivery A writes PROCESSING
delivery B writes PROCESSING
both call OpenAI
```

The status check and update must be one MongoDB operation.

## Step 1 - Add ObjectId Validation and Atomic Claim

In `repositories/applications.repository.ts`, add:

```ts
export async function claimPendingApplicationForScreening(
  applicationId: string,
): Promise<Application | null> {
  await dbConnect();

  if (!ObjectId.isValid(applicationId)) {
    return null;
  }

  const application = await ApplicationModel.findOneAndUpdate(
    {
      _id: new ObjectId(applicationId),
      screeningStatus: "PENDING",
    },
    {
      $set: { screeningStatus: "PROCESSING" },
      $unset: { screeningError: 1 },
    },
    { new: true },
  ).lean<ApplicationLean>();

  return application ? toApplication(application) : null;
}
```

`findOneAndUpdate` matches and changes the state atomically. A second delivery no longer finds a `PENDING` document.

## Step 2 - Replace the Day 11 Processing Entry Point

Update `services/screening/screening.service.ts`:

```ts
import "server-only";
import {
  claimPendingApplicationForScreening,
  updateApplicationScreening,
} from "@/repositories/applications.repository";
import { findJobById } from "@/repositories/jobs.repository";
import { analyzeApplicationResume } from "./openai-screening.service";

export async function processScreeningJob(
  applicationId: string,
): Promise<void> {
  const application =
    await claimPendingApplicationForScreening(applicationId);

  if (!application) {
    console.info("Screening job skipped", {
      applicationId,
      reason: "not found, invalid, or already claimed",
    });
    return;
  }

  const job = await findJobById(application.jobId);

  if (!job) {
    throw new Error("Application job was not found");
  }

  const result = await analyzeApplicationResume({
    application,
    job,
  });

  const completed = await updateApplicationScreening(application.id, {
    screeningStatus: "COMPLETED",
    aiScore: result.score,
    aiSummary: result.summary,
    aiStrengths: result.strengths,
    aiRisks: result.risks,
    screenedAt: new Date(),
  });

  if (!completed) {
    throw new Error("Application disappeared while saving screening result");
  }
}
```

This is the smallest working worker service. Lesson 06 adds retry/permanent classification around it.

## Step 3 - Understand Idempotency Scope

The claim protects these cases:

```txt
duplicate QStash delivery
manual redelivery
two workers receive the same message
late delivery after COMPLETED
late delivery after FAILED
```

It does not yet recover a worker that claimed `PROCESSING` and then crashed. Lesson 06 adds stale-state recovery.

## Step 4 - Test Concurrent Delivery

Create one test application in `PENDING`, then publish the same ID twice from a temporary server-only script:

```ts
await Promise.all([
  publishScreeningJob({ applicationId }),
  publishScreeningJob({ applicationId }),
]);
```

Expected:

```txt
one delivery -> receives application from atomic claim
other delivery -> receives null and returns success
OpenAI calls -> one
final status -> COMPLETED or classified failure
```

Remove the temporary script after the test.

## Step 5 - Verify Invalid IDs

Publish:

```json
{ "applicationId": "not-an-object-id" }
```

Expected:

- no Mongoose cast exception
- repository returns `null`
- worker logs a safe skip
- no provider call

Run:

```bash
npx tsc --noEmit
npm run lint
```

## Teaching Line

> Idempotency is not “check first.” It is “make the state transition itself impossible to win twice.”

## Next

Lesson 06 classifies failures, returns retryable work to `PENDING`, marks permanent failures safely, and recovers stale processing records.
