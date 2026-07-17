# Lecture 121 - Store AI Screening Results | حفظ نتائج التقييم الذكي

## Goal

Persist validated OpenAI output and make the application transition from `PROCESSING` to `COMPLETED`.

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

Lecture 122 completes failure handling, retries, pending UX, and operational recovery.
