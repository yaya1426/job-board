# Lecture 119 - Create Screening Job After Apply | إنشاء مهمة التقييم بعد التقديم

## Goal

Publish a durable screening job after saving an application and receive it through a protected worker route.

## Explain It Simply (For Beginners)

Lecture 118 was the *plan*; this is where we *build* the two ends of the queue:

- The **producer** — the code that drops the job onto the queue right after we save the application. It sends only the application's id, nothing else.
- The **worker route** — a protected endpoint the queue provider calls to deliver the job. It reloads the real data from the database and does the screening.

Why send *only* the id and not all the application data? Two reasons. First, the message stays tiny. Second, and more important: **never trust data that took a trip outside your server.** The worker looks up fresh, trustworthy data from MongoDB using the id, instead of believing whatever was stuffed into the message.

There's a classic reliability puzzle here called the **dual-write problem**: we do two things in a row — (1) save to the database, (2) publish to the queue. What if step 1 works but step 2 fails? Now we have an application that will never get screened. For the course we handle it simply (catch the failure, leave it `PENDING`, log it, add retry later) and just *name* the fancy production fix ("transactional outbox") without over-engineering.

The worker route also must **verify the queue provider's signature** — proof the request genuinely came from our queue and not a random attacker hitting the URL. And it can't rely on browser login cookies, because the caller is a server, not a logged-in person.

### Jargon decoder

- **Producer** = the code that *adds* a job to the queue.
- **Consumer / worker** = the code that *receives and processes* a job.
- **Signature verification** = checking a cryptographic stamp that proves the request came from the trusted queue provider.
- **Dual-write problem** = the risk that one of two required writes (DB + queue) succeeds while the other fails.
- **Idempotent claim** = atomically marking a job `PROCESSING` so two workers can't screen the same application at once.
- **Retryable vs non-retryable** = whether it's worth trying the job again (a temporary network blip) or not (permanently broken input).

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
