# Lecture 121 - The Screening Worker Route | مسار عامل التقييم

## Goal

One small win: build the protected endpoint the queue calls to deliver a job. It verifies the request really came from our queue, reads `{ applicationId }`, and hands off to the screening service. (The actual AI work lands in Lectures 123–124; here we just build a safe front door.)

## Explain It Simply (For Beginners)

The queue needs somewhere to deliver its message. That somewhere is a normal API route — the **worker** — but with a twist: the caller is *a server (the queue provider)*, not a logged-in person in a browser. So the usual "check the login cookie" trick doesn't apply.

Instead, the queue provider signs each request with a secret **signature**. Our route verifies that signature to prove the request is genuine and not some random attacker who found the URL. Think of it like a courier showing a tamper-proof seal instead of a personal ID.

If the signature checks out, we read the tiny `{ applicationId }` payload and pass it to the screening service. That's the whole job of this lesson.

### Jargon decoder

- **Worker / consumer** = the code that *receives and processes* a job from the queue.
- **Route handler** = a server endpoint (e.g. `app/api/screening/process/route.ts`) that responds to a request.
- **Signature verification** = checking a cryptographic stamp that proves the request came from the trusted queue provider.
- **2xx / retryable error** = a `2xx` response tells the queue "got it"; a retryable error tells it "try me again later."

## Files Created

```txt
app/api/screening/process/route.ts
```

## Step 1 - Create the Worker Route

Add `app/api/screening/process/route.ts` as a `POST` handler:

```ts
export const runtime = "nodejs";
```

The later screening pipeline uses the S3 SDK, `Buffer`, PDF parsing, and OpenAI, so keep this route on the Node.js runtime—not Edge.

It must not rely on browser session cookies—the caller is the queue provider, not a user.

Use the **public client-app origin** for the worker callback URL. This project's `proxy.ts` excludes `/api`, so `/api/screening/process` bypasses host-based page routing and remains reachable by the queue provider.

## Step 2 - Verify the Queue Provider Signature

Before doing anything else, verify the provider's signature using its current SDK/verification API. Reject unsigned or invalid requests immediately.

## Step 3 - Validate the Payload and Hand Off

1. Parse and validate `{ applicationId }`.
2. Call the screening orchestration service (implemented in Lectures 122–124).

### Temporary teaching stub

The real OpenAI orchestration does not exist until Lectures 123–124. For this lesson, use a small temporary stub that accepts a **controlled test application id**, reloads or validates it, logs only that safe id, and returns success.

Do not pretend screening completed and do not save a fake score. Remove the stub when the real orchestration is connected. During Lectures 120–121, test with a controlled queue message rather than expecting a real candidate application to receive an AI result.

## Step 4 - Return the Right Status

- Return `2xx` only when delivery is accepted/completed per the provider's semantics.
- Return a **retryable** error for transient failures so the queue tries again.

## Verification

- An unsigned or wrongly-signed request is rejected.
- A validly-signed request with a good `applicationId` reaches the screening service.
- The route works without any browser cookie.
- A controlled test delivery reaches the temporary stub; no fake screening result is persisted.

## Key Teaching Lines

> The worker trusts a provider signature, not a login cookie — the caller is a server.

> The route is a separate security boundary; it verifies every delivery itself.

## Next

Lecture 122 makes the worker safe to receive the same job twice (idempotency).
