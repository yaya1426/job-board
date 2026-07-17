# Lecture 122 - Make the Worker Idempotent | جعل العامل آمناً للتكرار

## Goal

One small win: make it safe for the worker to receive the **same** job more than once. We add focused status methods to the repository and an atomic "claim" so duplicate deliveries never double-screen an application.

## Explain It Simply (For Beginners)

Durable queues promise **at-least-once delivery** — which is great (nothing gets lost) but has a catch: sometimes the *same* message arrives twice (a retry fired, a network blip, etc.). If our worker naively screened every delivery, one candidate could get screened twice, wasting money and maybe saving conflicting results.

The fix is **idempotency**: running the job twice has the same effect as running it once. We do this with a **claim**. Before doing any work, the worker atomically flips the application from `PENDING` to `PROCESSING` — like grabbing a ticket. If a second delivery arrives and the ticket is already taken (or the work is already `COMPLETED`), it politely does nothing.

### Jargon decoder

- **At-least-once delivery** = the queue guarantees a message arrives, but may deliver it more than once.
- **Idempotent** = running it twice has the same result as running it once.
- **Atomic claim** = a single database update that marks the job `PROCESSING` so two workers can't grab it at the same time.
- **ObjectId validation** = checking the id is a real Mongo id before querying, so bad input fails safely.

## Files Updated

```txt
repositories/applications.repository.ts
services/screening/screening.service.ts
```

## Step 1 - Add Focused Status Repository Methods

Keep all Mongoose access in the repository:

```txt
markScreeningProcessing(id)
saveScreeningResult(id, result)
markScreeningFailed(id, safeError)
```

## Step 2 - Make Processing Idempotent

Before doing any screening work, in the orchestration service:

- validate the `ObjectId` safely
- load the application
- if already `COMPLETED`, return success without screening again
- atomically claim a `PENDING` (or retryable `FAILED`) record as `PROCESSING`
- if the claim fails (someone else already claimed it), stop

## Verification

- A duplicate delivery of an already-`COMPLETED` application does nothing.
- Two near-simultaneous deliveries do not both run screening.
- An invalid/unknown `applicationId` fails safely without crashing the worker.

## Key Teaching Lines

> At-least-once delivery means the consumer must be idempotent.

> Claim the work atomically before doing it; a status field is your lock.

## Next

Lecture 123 implements the OpenAI screening contract the worker calls once it has claimed a job.
