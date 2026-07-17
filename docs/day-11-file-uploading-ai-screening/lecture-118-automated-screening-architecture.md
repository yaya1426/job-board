# Lecture 118 - Automated Screening Architecture | معمارية التقييم التلقائي

## Goal

Design screening as durable background work rather than blocking the candidate’s apply request or requiring an admin click.

## Explain It Simply (For Beginners)

Imagine the candidate clicks **Apply** and then we make them stare at a spinner while we download their PDF, extract text, and wait for OpenAI to answer. That could take 10+ seconds, might time out, and if OpenAI hiccups, their application fails entirely. Terrible experience for something that isn't even their concern.

So we split it into two phases:

1. **Right now (fast):** save the application, drop a "please screen this" note into a **queue**, and immediately tell the candidate "you're done!"
2. **Later (background):** a separate **worker** picks up that note whenever it can, does the slow AI work, and updates the application.

Analogy: a coffee shop. You order and pay (application saved), your name goes on the cup and into the line (the queue), and you step aside. The barista (worker) makes drinks from the queue at their own pace. You're not blocking the register while your latte is poured.

**Why a real queue and not just "start the work and don't wait for it"?** Because on serverless/cloud hosting, the moment we send the response the server can shut down and *kill* any unfinished background work. A durable queue stores the job safely and retries it until a worker confirms success. It survives restarts.

The catch that comes with queues: a message may be delivered **more than once** ("at-least-once delivery"). So the worker must be **idempotent** — safe to run twice without doing the work or saving the result twice.

### Jargon decoder

- **Queue** = a durable to-do list of jobs that a provider stores and hands to workers reliably, retrying on failure.
- **Worker** = code that receives a job from the queue and does the actual processing (here, a protected API route).
- **Inline / blocking** = doing the work *during* the original request while the user waits. We're avoiding this.
- **Durable** = survives crashes/restarts; won't silently disappear.
- **Idempotent** = running it twice has the same effect as running it once (no duplicates).
- **Fire-and-forget** = starting async work without tracking it — unsafe here because it can be lost.
- **Payload** = the small data inside the queue message. We send only `{ applicationId }`; the worker reloads the rest from the database.

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
