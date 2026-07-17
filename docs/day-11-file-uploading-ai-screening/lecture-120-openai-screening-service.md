# Lecture 120 - OpenAI Screening Service | خدمة التقييم باستخدام OpenAI

## Goal

Send job requirements, cover letter, and extracted resume text to OpenAI and receive a validated structured screening result.

## Explain It Simply (For Beginners)

Now the fun part: we hand the job details and the resume text to OpenAI and ask, "how well does this candidate match, and why?" But we don't just want a paragraph of free-form chatter — we want a *predictable shape* our app can store and display: a score, a summary, strengths, and risks.

The key trick is **structured output validated by zod**. AI text is probabilistic — it might come back slightly different each time. By demanding a strict JSON shape and then validating it with a zod schema, we turn "vibes" into a **contract**: if the AI's answer doesn't fit the shape, we reject it rather than saving garbage.

Analogy: instead of asking an assistant to "write me some thoughts," you hand them a **fill-in-the-blank form** with exactly four boxes. Everyone's answer comes back in the same format you can file.

Two principles beginners should internalize:

- **Send the minimum personal data.** OpenAI only needs the job info + cover letter + resume text. It does *not* need the candidate's email, LinkedIn, or ids. Less data shared = less risk.
- **This is decision *support*, not a decision.** The score helps an admin review faster. It never auto-rejects anyone, and it must not judge protected characteristics (race, gender, age, etc.).

Notice `OPENAI_API_KEY` is server-only — like the storage keys, it must never reach the browser.

### Jargon decoder

- **SDK** = the official library that makes calling OpenAI easy from our code.
- **Structured output / JSON schema** = forcing the model to answer in an exact, machine-readable shape.
- **zod schema** = our validation rulebook; `.parse()` throws if the AI's answer doesn't match.
- **Prompt / instructions** = the directions we give the model about how to score and what to avoid.
- **Adapter** = a thin wrapper so OpenAI is a swappable detail *behind* our screening service, not woven through the whole app.
- **Transient error** = a temporary failure (rate limit, network) worth retrying.

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
