# Lesson 01 - The Burst and Timeout Problem

## Goal

Measure the Day 11 synchronous design before replacing it. The candidate request currently stays open for Spaces download, OpenAI file upload, Responses analysis, and database writes. The temporary provider file expires automatically after one hour and does not extend the request.

Run this only against local development or an isolated staging environment with synthetic resumes and test accounts. Never load-test production or use real candidate data.

## Step 1 - Capture a Single-Request Baseline

In browser DevTools, submit one synthetic resume and record:

```txt
total apply request duration
time application first appears as PENDING
time it changes to PROCESSING
time it reaches COMPLETED or FAILED
OpenAI request duration and status
```

Repeat three times and note normal variance.

## Step 2 - Add a Disposable Development-Only Probe

Create `app/api/dev/screening-load/route.ts` temporarily:

```ts
import { applyToJob } from "@/services/applications/applications.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const result = await applyToJob(Object.fromEntries(formData));

  return Response.json(result, {
    status: result.success ? 200 : 400,
  });
}
```

This route reuses the real authenticated service. It must be removed after the exercise. Use a test candidate session and multiple test jobs because duplicate-application protection should remain enabled.

## Step 3 - Create a Capped Burst Script

Create `scripts/measure-screening-burst.mjs` temporarily:

```js
import { readFile } from "node:fs/promises";

const baseUrl = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const cookie = process.env.TEST_SESSION_COOKIE;
const resumePath = process.env.TEST_RESUME_PATH;
const jobIds = (process.env.TEST_JOB_IDS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean)
  .slice(0, 5);

if (!cookie || !resumePath || jobIds.length < 2) {
  throw new Error(
    "Set TEST_SESSION_COOKIE, TEST_RESUME_PATH, and 2-5 TEST_JOB_IDS",
  );
}

const bytes = await readFile(resumePath);

async function submit(jobId, index) {
  const form = new FormData();
  form.set("jobId", jobId);
  form.set("candidateName", `Load Test Candidate ${index}`);
  form.set("candidateEmail", `load-test-${index}@example.test`);
  form.set("candidateLinkedin", "https://linkedin.com/in/load-test");
  form.set("candidateCoverLetter", "Synthetic staging load test.");
  form.set(
    "resume",
    new File([bytes], `synthetic-${index}.pdf`, {
      type: "application/pdf",
    }),
  );

  const startedAt = performance.now();
  const response = await fetch(`${baseUrl}/api/dev/screening-load`, {
    method: "POST",
    headers: { cookie },
    body: form,
  });
  const body = await response.json();

  return {
    jobId,
    status: response.status,
    durationMs: Math.round(performance.now() - startedAt),
    success: body.success,
  };
}

const results = await Promise.all(jobIds.map(submit));
console.table(results);
```

Run a deliberately small test:

```bash
TEST_BASE_URL=http://localhost:3000 \
TEST_SESSION_COOKIE='next-auth.session-token=REDACTED' \
TEST_RESUME_PATH='./fixtures/synthetic-resume.pdf' \
TEST_JOB_IDS='JOB_ID_1,JOB_ID_2,JOB_ID_3' \
node scripts/measure-screening-burst.mjs
```

Never commit the cookie or synthetic fixture. Keep the cap of five requests while teaching; this is a demonstration, not a capacity benchmark.

## Step 4 - Demonstrate an Interrupted Request

In local development:

1. Submit one synthetic application.
2. Wait until MongoDB shows `PROCESSING`.
3. Stop the local dev server.
4. Restart it.
5. Inspect the application.

Depending on the interruption point, the record can remain `PENDING` or `PROCESSING`. The synchronous request has no independent delivery mechanism to resume it.

Use MongoDB Compass or a safe read-only shell query:

```js
db.applications.find(
  { screeningStatus: { $in: ["PENDING", "PROCESSING"] } },
  { candidateEmail: 1, screeningStatus: 1, appliedDate: 1, screenedAt: 1 },
)
```

## Step 5 - Remove the Probe

Delete:

```txt
app/api/dev/screening-load/route.ts
scripts/measure-screening-burst.mjs
```

Remove test applications, jobs, and synthetic resumes from the isolated environment using the normal admin/database cleanup process.

## Expected Observations

- Every candidate request includes provider latency.
- A small burst holds multiple request slots open simultaneously.
- Provider limits or platform timeouts can surface as submission-path delays.
- Interrupted requests can strand status records.
- The application may already be saved even when later screening work fails.

## Teaching Line

> We are not adding infrastructure because queues sound professional. We are adding it because the measured request lifecycle cannot reliably own long external work.

## Next

Lesson 02 designs a durable payload and separates submission from screening execution.
