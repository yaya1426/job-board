# Lecture 120 - Publish a Screening Job After Apply | نشر مهمة التقييم بعد التقديم

## Goal

One small win: right after an application is saved, drop a tiny "please screen this" message onto a durable queue — then return success immediately. No AI work happens in this lesson; we only *enqueue* the job.

## Explain It Simply (For Beginners)

We don't want the candidate waiting while we read a PDF and call OpenAI. So the moment the application is saved, we hand off a note to a **queue** and tell the candidate "you're done." A separate worker (built in the next lectures) picks the note up later.

The note is deliberately tiny — just `{ applicationId }`. Why not include all the data? Two reasons: the message stays small, and, more importantly, **never trust data that took a trip outside your server.** The worker will reload fresh, trustworthy data from MongoDB using the id.

There's a classic reliability puzzle here, the **dual-write problem**: we do two things in a row — (1) save to the database, (2) publish to the queue. What if step 1 works but step 2 fails? For the course we handle it simply (catch the failure, leave the application `PENDING`, log it) and just *name* the production-grade fix ("transactional outbox") without building it.

### Jargon decoder

- **Queue** = a durable to-do list a provider stores and reliably hands to workers, retrying on failure.
- **Producer** = the code that *adds* a job to the queue (this lesson).
- **Payload** = the small data inside the message. We send only `{ applicationId }`.
- **Dual-write problem** = the risk that one of two required writes (DB + queue) succeeds while the other fails.

## Prerequisite Decision

Select the queue provider from Lecture 119 before recording. The steps below assume an HTTP queue such as QStash; use the provider's current SDK and signature-verification API.

## Files Created/Updated

```txt
services/screening/screening-queue.service.ts
services/applications/applications.service.ts
```

## Step 1 - Add Queue Environment Variables

Add the provider token/signing keys and a public worker URL to local and deployment environments.

Never expose queue credentials with `NEXT_PUBLIC_`.

## Step 2 - Create the Producer

```ts
queueApplicationScreening(applicationId: string)
```

It publishes only:

```json
{ "applicationId": "..." }
```

The worker will reload trusted application/job/resume data from MongoDB.

## Step 3 - Queue After Persistence

Update `applyToJob`:

```txt
save application as PENDING
  -> publish job with the saved application id
  -> return application success
```

Handle the dual-write problem simply for now:

- catch publish failure
- leave the application `PENDING` (or mark a queue failure explicitly)
- log only safe identifiers
- provide retry/reconciliation later

Production hardening to name (not build): the transactional outbox pattern.

## Verification

- Applying returns without waiting for OpenAI.
- Exactly one job is published, carrying the application id.
- A publish failure does not lose or corrupt the saved application.

At this point the real worker orchestration is not built yet. Use a controlled test application/message while recording and verify delivery in the queue dashboard. Lecture 121 adds a temporary receiving stub; do not expect a real AI result until Lectures 123–124.

## Key Teaching Lines

> Queue messages carry identifiers; workers reload trusted state.

> Database write plus message publish is a reliability boundary worth naming.

## Next

Lecture 121 receives this job in a protected worker route.
