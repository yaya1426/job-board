# Lesson 09 - Recap Day 16

## Goal

Verify the final architecture and connect every new mechanism to the Day 11 problem it solves.

## From Day 11 to Day 16

```txt
Day 11
candidate request
  -> save application
  -> wait for OpenAI
  -> persist result
  -> return

Day 16
candidate request
  -> save application
  -> publish applicationId
  -> return

signed background delivery
  -> atomic claim
  -> existing OpenAI operation
  -> persist result or recover safely
```

The PDF analysis itself did not need rewriting. Architecture changed around the already-proven operation.

## Step 1 - Verify the Complete Flow

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Then verify:

1. Candidate submits a synthetic PDF.
2. Private Spaces stores the durable original.
3. MongoDB stores the application snapshot as `PENDING`.
4. QStash receives only `{ applicationId }`.
5. Candidate receives application success without waiting for OpenAI.
6. Signed worker delivery validates the payload.
7. Atomic claim moves exactly one delivery to `PROCESSING`.
8. Worker reloads trusted application and job data.
9. OpenAI Files receives a temporary `user_data` PDF with one-hour `expires_after`.
10. Responses returns zod-validated structured output.
11. The temporary file remains available only until automatic expiration.
12. MongoDB stores `COMPLETED` or a classified recovery state.
13. Candidate/admin UI shows honest asynchronous status.

## Step 2 - Verify Reliability Cases

```txt
duplicate delivery       -> skipped
invalid ObjectId         -> skipped without cast failure
unsigned request         -> rejected before handler
invalid signed payload   -> rejected before service
429 / timeout / 5xx      -> PROCESSING -> PENDING -> redelivery
permanent missing data   -> FAILED + safe message
worker interruption      -> stale PROCESSING recovered
publish-after-save gap   -> old PENDING republished
admin retry              -> FAILED -> PENDING once
```

## Step 3 - Verify Privacy Boundaries

```bash
rg "NEXT_PUBLIC_QSTASH|NEXT_PUBLIC_OPENAI" .
rg "resumeBytes|candidateEmail|coverLetter|fileId" services/screening
rg "extractResumeText|pdf-parse|Assistants API|Chat Completions" .
```

Expected:

- no provider secret reaches client code
- delivery payload has only `applicationId`
- no local PDF extraction architecture
- no temporary OpenAI file ID is persisted
- no resume contents or PII are logged

## Step 4 - Review State Ownership

```txt
PENDING
  application saved; waiting for claim or reconciliation

PROCESSING
  one worker owns the current attempt

COMPLETED
  validated result and screenedAt persisted

FAILED
  permanent/safe failure; human review still possible
```

Hiring `status` remains separate from `screeningStatus`.

## Step 5 - Name Remaining Production Caveats

- MongoDB save plus QStash publish is still a dual write; age-based reconciliation is not a transactional outbox.
- Retry classification must be monitored and refined from real provider errors.
- Reconciliation needs a protected scheduler and operational alerting.
- Queue depth, delivery failures, latency, OpenAI cost, provider errors, file expiration behavior, and stale states need monitoring.
- AI output requires representative quality/bias evaluation and human review.
- Resume and provider retention policies need documented ownership.

## Closing Line

> Day 16 earns its queue: measured synchronous pain becomes minimal payloads, verified delivery, atomic ownership, recoverable failures, and fast candidate submissions.

## Final Checklist

```txt
[ ] safe burst demonstration completed outside production
[ ] minimal zod payload enforced
[ ] QStash publish occurs after persistence
[ ] saved application never becomes candidate-facing failure
[ ] worker signature and payload are verified
[ ] atomic claim prevents duplicate OpenAI work
[ ] retryable and permanent failures diverge correctly
[ ] stale PENDING/PROCESSING records are recoverable
[ ] temporary OpenAI files use one-hour automatic expiration
[ ] async admin/candidate UX is honest
[ ] environment and deployment matrix passes
```
