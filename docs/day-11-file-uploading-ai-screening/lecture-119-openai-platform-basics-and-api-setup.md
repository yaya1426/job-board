# Lecture 119 - *OpenAI Platform Basics and API Setup* | أساسيات منصة OpenAI وإعداد API

## Goal

Tour the OpenAI developer platform, install the current JavaScript SDK, create a server-only client, and prove the API key/model configuration with a disposable text smoke test.

## Implementation Status
**Implemented** — Server-only OpenAI client and env vars are wired.

## Key Files (as implemented today)
- `lib/openai.ts`
- `package.json`

## Gaps vs This Lecture (if any)
- Disposable smoke-test API route from the lecture may not remain in the repo — verify before recording.
- `OPENAI_API_KEY` and `OPENAI_MODEL` must be set locally and on App Platform (runtime + build if referenced at build time).

## Platform Tour

1. Open the OpenAI Platform, not the ChatGPT consumer app.
2. Show **API keys** and create a project-scoped key for server use.
3. Show **project billing, usage, budgets, and rate limits**. A ChatGPT subscription does not include API credits; API usage is billed separately.
4. Show the **Playground** for testing instructions and models before writing application code.
5. Compare the two APIs used in this course:
  - **Files API** temporarily receives the private PDF and returns a `file_id`.
  - **Responses API** receives that `file_id`, job context, and instructions, then returns a structured result.
6. Choose a current vision-capable model that accepts PDF file input and supports structured outputs. Keep the model configurable rather than hard-coding it.

Official references:

- [File inputs](https://developers.openai.com/api/docs/guides/file-inputs)
- [Structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Files API reference](https://developers.openai.com/api/reference/resources/files/)



## Step 1 - Install the SDK

Run during the lecture:

```bash
npm install openai
```

This documentation does not edit `package.json`; the command is the follow-along implementation step.

## Step 2 - Add Server-Only Environment Variables

Add locally to `.env.local` and later to the deployment environment:

```bash
OPENAI_API_KEY=replace-with-a-project-api-key
OPENAI_MODEL=gpt-5.6-terra
```

`gpt-5.6-terra` supports the Responses API and balances capability with cost, which makes it the better starting point for resume screening. The shorter `gpt-5.6` identifier is valid, but it currently aliases to the more expensive flagship `gpt-5.6-sol`. Confirm model access and pricing when recording; keeping it in `OPENAI_MODEL` lets the course change models without editing the service.

Never prefix either variable with `NEXT_PUBLIC_`. Restart `npm run dev` after changing environment variables.

## Step 3 - Create `lib/openai.ts`

```ts
import "server-only";
import OpenAI from "openai";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export const openai = new OpenAI({
  apiKey: requireEnv("OPENAI_API_KEY"),
});

export const openaiModel = requireEnv("OPENAI_MODEL");
```

This module follows the same configuration pattern as `lib/storage.ts`: validate server secrets once and export a configured client.

## Step 4 - Add a Disposable Smoke-Test Route

Temporarily create `app/api/openai-smoke/route.ts`:

```ts
import { openai, openaiModel } from "@/lib/openai";

export const runtime = "nodejs";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  const response = await openai.responses.create({
    model: openaiModel,
    input: "Reply with exactly: OpenAI connection works",
  });

  return Response.json({ text: response.output_text });
}
```

Start the app and call it once:

```bash
npm run dev
curl http://localhost:3000/api/openai-smoke
```

Expected shape:

```json
{ "text": "OpenAI connection works" }
```



## Step 5 - Remove the Test Surface

Delete `app/api/openai-smoke/route.ts` immediately after the successful test. Do not ship an unauthenticated endpoint that spends API credit.

Then run:

```bash
npx tsc --noEmit
```



## Recording Notes

- This course uses the **Responses API**, not Assistants API or Chat Completions.
- The smoke test intentionally sends no resume or personal data.
- Model availability and pricing change. Confirm `OPENAI_MODEL` in the current model documentation and project access while recording.



## Next

Lecture 120 reads the private resume bytes from DigitalOcean Spaces and uploads a short-lived copy to the OpenAI Files API.