# Lesson 04 - Protected Screening Worker Route

## Goal

Accept only signed QStash deliveries, validate their JSON payload, and hand processing to a service. The route owns HTTP concerns; the service owns screening.

Before recording, recheck the current `verifySignatureAppRouter` import and wrapper signature in the installed `@upstash/qstash` version.

## Implementation Status

**Planned — not in codebase** (QStash worker, atomic claims, async screening UX)

## Step 1 - Add Signing Keys

Add to local/staging/production server environments:

```env
QSTASH_CURRENT_SIGNING_KEY=...
QSTASH_NEXT_SIGNING_KEY=...
```

QStash rotates keys by exposing current and next values. Never expose them to the browser.

## Step 2 - Create the Worker Route

Create `app/api/screening/process/route.ts`:

```ts
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { z } from "zod";
import { screeningJobSchema } from "@/services/screening/screening-job.validation";
import { processScreeningJob } from "@/services/screening/screening.service";

export const runtime = "nodejs";

async function handler(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const validated = screeningJobSchema.safeParse(body);

  if (!validated.success) {
    return Response.json(
      {
        message: "Invalid screening job",
        issues: z.flattenError(validated.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  await processScreeningJob(validated.data.applicationId);

  return Response.json({ accepted: true });
}

export const POST = verifySignatureAppRouter(handler);
```

The wrapper rejects unsigned or incorrectly signed requests before `handler` processes them. The payload is still validated because a valid signature proves the sender, not that the body matches the application contract.

The Node runtime is required by the S3/OpenAI path and avoids accidentally running that code in an Edge runtime.

## Step 3 - Keep the Route Thin

The route should not:

- import Mongoose models
- fetch Spaces bytes directly
- call OpenAI directly
- implement status transitions
- contain retry classification

Those belong to the service/repository layers. Lesson 05 implements `processScreeningJob`.

## Step 4 - Test Signature Protection

An unsigned direct request should be rejected:

```bash
curl -i \
  -X POST \
  -H 'content-type: application/json' \
  -d '{"applicationId":"test"}' \
  https://dev.wazifa.app/api/screening/process
```

Expected: a signature-verification error response. Exact status/body can vary by SDK version; the handler must not run.

Then publish through QStash and confirm the signed delivery reaches the handler.

## Step 5 - Test Payload Validation

Use the QStash console or a temporary server-side publish call to send a signed but invalid body:

```json
{
  "applicationId": "",
  "candidateEmail": "should-not-be-here@example.test"
}
```

Expected:

- signature verification passes
- zod validation fails
- processing service is not called
- no resume or provider data appears in logs

## Step 6 - Verify Environment Separation

```bash
rg "QSTASH_CURRENT_SIGNING_KEY|QSTASH_NEXT_SIGNING_KEY" .
rg "NEXT_PUBLIC_QSTASH" .
```

Expected:

- key names may appear in documentation/config checks
- key values never appear in source
- no `NEXT_PUBLIC_QSTASH_*` variable exists

Run:

```bash
npx tsc --noEmit
npm run lint
```

## Next

Lesson 05 makes redelivery safe with ObjectId validation and an atomic `PENDING -> PROCESSING` claim.
