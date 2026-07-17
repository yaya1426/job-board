# Lecture 120 - OpenAI Screening Service | خدمة التقييم باستخدام OpenAI

## Goal

Send job requirements, cover letter, and extracted resume text to OpenAI and receive a validated structured screening result.

## Dependencies and Environment

Install the current OpenAI JavaScript SDK during recording:

```bash
npm install openai
```

Add a server-only environment variable:

```env
OPENAI_API_KEY=...
```

Choose and pin an appropriate current model before recording; do not hardcode a stale model name in course documentation.

## Files Created

```txt
lib/openai.ts
services/screening/screening.validation.ts
services/screening/screening.service.ts
```

## Step 1 - Create the Server-Only Client

`lib/openai.ts`:

- import `server-only`
- validate `OPENAI_API_KEY`
- export one OpenAI client

## Step 2 - Define the Output Contract

Use zod:

```ts
export const screeningResultSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string().min(1).max(2000),
  strengths: z.array(z.string()).max(5),
  risks: z.array(z.string()).max(5),
});
```

Prefer OpenAI structured outputs/JSON schema if supported by the selected model/SDK.

## Step 3 - Build Minimal Screening Input

Send only what is needed:

```txt
job title
job description
job requirements
candidate cover letter
extracted resume text
```

Do not send email, LinkedIn URL, ids, or unrelated profile data.

## Step 4 - Write the Screening Instructions

Require the model to:

- compare evidence against listed requirements
- score 0–100
- explain strengths and risks
- avoid inventing experience
- treat missing evidence as unknown
- return the exact structured shape
- avoid protected-trait judgments

## Step 5 - Implement the Service

Create:

```ts
screenApplication(input): Promise<ScreeningResult>
```

Flow:

```txt
build request
  -> call OpenAI
  -> parse structured response
  -> validate with zod
  -> return normalized result
```

## Step 6 - Handle Provider Errors

Classify:

- transient provider/rate-limit/network errors → retryable
- invalid structured output → retryable within a limit
- invalid/missing resume text → non-provider failure

Never expose raw provider errors or prompts to candidates.

## Step 7 - Discuss Responsible Use

The result assists admin review:

- not an automatic rejection
- not a final hiring decision
- must not evaluate protected characteristics
- should be auditable and explainable

## Verification

- valid input returns schema-valid output
- malformed response is rejected
- score remains in range
- API key never reaches browser
- logs do not contain resume text

## Key Teaching Lines

> OpenAI is an adapter behind our screening service, not our application architecture.

> Structured output turns probabilistic text into a contract the app can validate.

## Next

Lecture 121 persists the structured result and completes the application’s screening state.
