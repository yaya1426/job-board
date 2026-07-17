# Lecture 124 - Store AI Screening Results | حفظ نتائج التقييم الذكي

## Goal

Persist validated OpenAI output and make the application transition from `PROCESSING` to `COMPLETED`.

## Explain It Simply (For Beginners)

OpenAI gave us a validated result. Now we save it and flip the application's status to `COMPLETED` so the admin UI knows there's something real to show.

The one rule to burn into students' minds here: **save the status and the data together, atomically.** We never want a moment where the database says `COMPLETED` but the score/summary fields are empty — that would make the UI confidently display nothing. So the update sets the results *and* the status in one operation.

Analogy: shipping an order. You don't mark it "Delivered" and *then* put the package on the porch. You do both as one confirmed step, so "Delivered" always means the box is actually there.

We also only show the AI results in the admin UI when the status is `COMPLETED`. For any other state (pending, processing, failed), we show a status indicator instead — and the UI must not crash on older applications that never had these fields.

We store the *decision-support result* (score, summary, strengths, risks) — not the full resume text or the raw prompt, unless there's a clear reason and a retention policy. Keep only what you need.

### Jargon decoder

- **Atomic update** = a single database write that either fully happens or not at all — no half-saved state.
- **State transition** = moving from one status to the next (`PROCESSING` → `COMPLETED`).
- **Mapper / serialize** = the repository step that turns database types (ObjectId, Date) into plain strings so they're safe to send to React.
- **Audit fields** (optional) = extra info like which model/version produced the result, useful for later debugging.

## Files Updated

```txt
types/Application.ts
lib/models/application.model.ts
repositories/applications.repository.ts
services/screening/screening.service.ts
components/applications/*
```

## Step 1 - Finalize Result Fields

```ts
aiScore?: number;
aiSummary?: string;
aiStrengths?: string[];
aiRisks?: string[];
screenedAt?: string;
screeningStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
```

Optional audit fields:

```txt
screeningModel
screeningVersion
```

Do not persist prompts or full resume text unless there is a clear need and retention policy.

## Step 2 - Update the Schema

- add bounds for `aiScore`
- default arrays appropriately or leave optional
- add `screenedAt`
- add screening status enum
- keep AI fields optional until completion

## Step 3 - Add Focused Repository Update

Create:

```ts
saveScreeningResult(applicationId, result)
```

The update should atomically set:

```txt
aiScore
aiSummary
aiStrengths
aiRisks
screenedAt
screeningStatus=COMPLETED
```

and clear a prior safe `screeningError`.

## Step 4 - Complete Worker Orchestration

```txt
load application/job
  -> extract resume text
  -> screen with OpenAI
  -> validate result
  -> save result as COMPLETED
```

## Step 5 - Update Admin UI

Render results only when `COMPLETED`:

- score
- summary
- strengths
- risks
- screened timestamp

For other states, render status UI instead.

## Verification

- completed application has all required result fields
- mapper serializes `screenedAt`
- admin UI does not crash on legacy/pending records
- duplicate worker delivery skips already completed result

## Key Teaching Lines

> Persist status and result together so the database never claims completion without data.

> Store the decision-support result, not unnecessary raw personal content.

## Next

Lecture 125 completes failure handling, retries, pending UX, and operational recovery.
