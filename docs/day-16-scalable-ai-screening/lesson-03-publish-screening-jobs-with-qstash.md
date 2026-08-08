# Lesson 03 - Publish Screening Jobs with QStash

## Goal

Publish `{ applicationId }` after the application is saved, then return application success immediately instead of waiting for OpenAI.

Before recording, recheck the current `@upstash/qstash` package documentation and TypeScript signatures. This lesson uses the current researched pattern:

```ts
Client.publishJSON({ url, body, retries })
```

## Step 1 - Install the SDK

```bash
npm install @upstash/qstash
```

## Step 2 - Configure Server-Only Variables

Add to `.env.local` and the deployment environment:

```env
QSTASH_TOKEN=...
APP_BASE_URL=https://dev.wazifa.app
```

`APP_BASE_URL` must be reachable by QStash. `http://localhost:3000` is not reachable from the public QStash service. For local end-to-end testing, use an approved temporary tunnel and synthetic data; otherwise test delivery in staging.

Never use `NEXT_PUBLIC_` for either value.

## Step 3 - Create the QStash Client

Create `lib/qstash.ts`:

```ts
import "server-only";
import { Client } from "@upstash/qstash";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export const qstash = new Client({
  token: requireEnv("QSTASH_TOKEN"),
});

export const appBaseUrl = requireEnv("APP_BASE_URL").replace(/\/$/, "");
```

## Step 4 - Create the Publisher

Create `services/screening/screening-jobs.service.ts`:

```ts
import "server-only";
import { appBaseUrl, qstash } from "@/lib/qstash";
import type { ScreeningJob } from "./screening-job.validation";

const SCREENING_RETRIES = 3;

export async function publishScreeningJob(
  job: ScreeningJob,
): Promise<string> {
  const message = await qstash.publishJSON({
    url: `${appBaseUrl}/api/screening/process`,
    body: job,
    retries: SCREENING_RETRIES,
  });

  return message.messageId;
}
```

The payload type permits only `applicationId`. Do not include resume metadata or candidate PII for convenience.

## Step 5 - Replace the Synchronous Trigger

In `services/applications/applications.service.ts`, replace the Day 11 `screenApplication(...)` call with:

```ts
import { publishScreeningJob } from "@/services/screening/screening-jobs.service";
```

After `saveNewApplication(...)` returns:

```ts
try {
  await publishScreeningJob({
    applicationId: newApplication.id,
  });
} catch (error) {
  console.error("Failed to publish screening job", {
    applicationId: newApplication.id,
    message: error instanceof Error ? error.message : "Unknown error",
  });
}

return { success: true, data: newApplication };
```

The application is already durable. Publishing failure must not produce a candidate-facing application error or encourage duplicate submission.

This request still waits briefly for QStash to acknowledge the publish, but it no longer waits for Spaces download, OpenAI upload, analysis, or result persistence.

## Step 6 - Explain the Dual-Write Limitation

The order is:

```txt
1. MongoDB save
2. QStash publish
```

If step 2 fails, the application remains `PENDING`. The catch preserves submission success, but logging alone is not complete recovery. Lesson 06 adds age-based reconciliation; a transactional outbox is the stronger future option when guaranteed dispatch is required.

Never reverse the order. Publishing before the application exists lets a fast worker receive an ID it cannot load.

## Step 7 - Verify Publishing

With the worker route from Lesson 04 deployed, submit one synthetic application and verify:

```txt
MongoDB application exists before delivery
QStash message body contains only applicationId
candidate response returns before OpenAI finishes
message targets /api/screening/process
configured retries equals 3
```

For a controlled dispatch failure, temporarily use an invalid staging token:

```txt
application saved        -> yes
candidate sees submitted -> yes
screeningStatus          -> PENDING
safe publish error log   -> yes
```

Restore the token immediately.

Run:

```bash
npx tsc --noEmit
npm run lint
```

## Next

Lesson 04 creates the signed Node worker route and hands validated jobs to the processing service.
