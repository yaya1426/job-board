# Lecture 118 - Automated Screening Architecture | معمارية التقييم التلقائي

## Goal

Design screening as durable background work rather than blocking the candidate’s apply request or requiring an admin click.

## Problem to Show

Doing this inline is risky:

```txt
apply request
  -> upload/parse PDF
  -> wait for OpenAI
  -> save result
  -> finally respond
```

Problems:

- slow candidate response
- request timeout risk
- OpenAI failure can break application submission
- retries may duplicate work
- serverless/process shutdown can lose fire-and-forget work

## Target Architecture

```txt
applyToJob
  -> save application as PENDING
  -> publish application.created
  -> return success immediately

queue
  -> deliver applicationId to worker

worker
  -> claim application as PROCESSING
  -> extract PDF text
  -> call OpenAI
  -> save COMPLETED or FAILED
```

## Queue Decision

Use a durable HTTP queue/pub-sub provider for the tutorial’s deployed architecture. Recommended shape:

- producer publishes `{ applicationId }`
- provider calls a protected worker route
- worker verifies provider signature
- retries use the same application id

Do not use an un-awaited promise after the response; it is not durable.

Possible provider: Upstash QStash. Confirm the provider before recording Lecture 119 and use its current SDK/signature verification documentation.

## Idempotency Rules

The worker must safely receive duplicate deliveries:

- `COMPLETED` → return success without screening again
- `PROCESSING` → avoid duplicate concurrent work or use a lease
- `PENDING`/`FAILED` → process according to retry policy

Use application id as the job identity.

## Failure Ownership

Application submission succeeds once the application is persisted and the job is durably queued.

Screening failure changes screening state; it does not delete the application.

## Files Planned

```txt
services/screening/screening-queue.service.ts
app/api/screening/process/route.ts
services/screening/screening.service.ts
repositories/applications.repository.ts
```

## Recording Steps

1. Draw inline vs queued workflows.
2. Explain why fire-and-forget is unsafe.
3. Choose the durable queue contract.
4. Define the message payload.
5. Define status transitions and idempotency.
6. Define which failures affect application submission.

## Key Teaching Lines

> Automatic does not mean inline.

> A queue separates candidate-facing latency from expensive AI work.

> At-least-once delivery means the consumer must be idempotent.

## Next

Lecture 119 implements the producer and worker route after the application is saved.
