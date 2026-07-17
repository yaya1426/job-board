# Lecture 116 - Mark Screening as Pending | تجهيز حالة التقييم

## Goal

One small win: every new application starts life as `screeningStatus: PENDING`, and we stop faking `aiScore: 0`. This is the tiny seed that the whole automated-screening pipeline will grow from.

## Explain It Simply (For Beginners)

Right now the code writes `aiScore: 0` on every application. That's a lie — it looks like "this candidate scored 0 out of 100," when really *no AI has looked at them yet*. Those are completely different things.

So we introduce a **status** field that honestly tracks where the AI review is:

```txt
PENDING -> PROCESSING -> COMPLETED
                     -> FAILED
```

A brand-new application is `PENDING` ("saved, waiting for the AI"). The actual score stays **absent** until screening finishes. Remember: **a missing score is not a score of zero.**

That's the whole lesson. We're not building the AI yet — just giving the application an honest place to record its progress.

### Jargon decoder

- **Enum** = a field allowed to be only one of a fixed set of values (here, the four statuses).
- **Optional field** = a field that may be absent (like `aiScore` before screening finishes), which is different from a field that is present but `0`.
- **Default value** = what the database uses when we don't set the field (here, `PENDING`).

## Files Updated

```txt
types/Application.ts
lib/models/application.model.ts
repositories/applications.repository.ts
services/applications/applications.service.ts
```

## Step 1 - Add the Status (and Optional Result Fields) to the Type

```ts
screeningStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
```

The AI result fields can be added now as **optional** (they get filled in later, in Lecture 124):

```ts
aiScore?: number;
aiSummary?: string;
aiStrengths?: string[];
aiRisks?: string[];
screenedAt?: string;
screeningError?: string;
```

## Step 2 - Update the Mongoose Schema

- Add a `screeningStatus` enum with default `PENDING`.
- Make `aiScore` **optional** instead of writing the fake value `0`.
- Keep the AI result fields optional until screening completes.

## Step 3 - Set PENDING on Save

Update `applyToJob` so a newly saved application:

```txt
-> screeningStatus = PENDING
-> no fake aiScore
```

## Step 4 - Keep Optional Fields Serializable

In the repository mapper, make sure the optional AI fields and arrays still serialize cleanly (absent stays absent; arrays are plain arrays) so pages don't crash on applications that have not been screened yet.

## Verification

- New applications start as `PENDING`.
- `aiScore` is **absent** until screening completes (never `0`).
- Admin/list pages render fine for applications with no AI result yet.

## Key Teaching Lines

> A missing score is different from a score of zero.

> Async work needs a status field from day one, even before the async work exists.

## Next

Lecture 117 lets admins open the private resume and see the screening status in the dashboard.
