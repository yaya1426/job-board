# Lecture 119 - Create Screening Job After Apply | إنشاء مهمة التقييم بعد التقديم

## Goal

Publish a durable screening job after saving an application and receive it through a protected worker route.

## Prerequisite Decision

Select the queue provider from Lecture 118 before recording. The steps below assume an HTTP queue such as QStash; use the provider’s current SDK and signature-verification API.

## Files Created/Updated

```txt
services/screening/screening-queue.service.ts
app/api/screening/process/route.ts
services/applications/applications.service.ts
repositories/applications.repository.ts
```

## Step 1 - Add Queue Environment Variables

Add provider token/signing keys and a public worker URL to local/deployment environments.

Never expose queue credentials with `NEXT_PUBLIC_`.

## Step 2 - Create the Producer

Create:

```ts
queueApplicationScreening(applicationId: string)
```

It publishes only:

```json
{ "applicationId": "..." }
```

The worker reloads trusted application/job/resume data from MongoDB.

## Step 3 - Queue After Persistence

Update `applyToJob`:

```txt
save application as PENDING
  -> publish job with saved application id
  -> return application success
```

Discuss the dual-write problem: database save may succeed while publishing fails.

For the first course version:

- catch publish failure
- leave application `PENDING` or mark queue failure explicitly
- log only safe identifiers
- provide retry/reconciliation later

Production hardening: transactional outbox pattern.

## Step 4 - Create the Worker Route

The worker route must:

1. Verify queue-provider signature.
2. Validate `{ applicationId }`.
3. Call the screening orchestration service.
4. Return `2xx` only when delivery is accepted/completed according to provider semantics.
5. Return retryable errors for transient failures.

It must not rely on browser session cookies.

## Step 5 - Add Status Repository Methods

Add focused methods:

```txt
markScreeningProcessing(id)
saveScreeningResult(id, result)
markScreeningFailed(id, safeError)
```

Keep Mongoose access in the repository.

## Step 6 - Make Processing Idempotent

Before processing:

- validate ObjectId safely
- load application
- skip if already `COMPLETED`
- atomically claim `PENDING`/retryable `FAILED` as `PROCESSING`

## Verification

- applying returns without waiting for OpenAI
- one job is published with application id
- unsigned worker request is rejected
- duplicate delivery does not duplicate completed screening
- publish failure does not lose the application

## Key Teaching Lines

> Queue messages carry identifiers; workers reload trusted state.

> Database write plus message publish is a reliability boundary worth naming.

## Next

Lecture 120 implements the OpenAI screening contract consumed by the worker.
