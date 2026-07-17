# Day 11 - File Uploading and AI Screening

## Goal

Turn the fake resume UI and static AI score into a private, asynchronous application workflow: candidates submit a PDF with their application, the server validates it and uploads it to private DigitalOcean Spaces, MongoDB stores the object metadata, and a durable worker screens the application through OpenAI. (We upload through our server for simplicity; presigned direct-to-Spaces upload is named as a future scaling upgrade.)

## Planning Status

Infrastructure setup has started, but the application pipeline is not implemented yet.

Current audited state on `develop`:

- DigitalOcean Space was provisioned externally.
- S3 client and presigner dependencies are installed in the working tree.
- `.env.local` contains the six existing `DO_SPACES_*` variables, including `DO_SPACES_PUBLIC_URL`; deployment settings still need verification.
- `OPENAI_API_KEY` is not present yet, which is expected before Lecture 123.
- Storage client, server-side upload, resume input, metadata persistence, PDF extraction, queue worker, and OpenAI integration are not implemented.
- The lesson files below are the instructor-ready source of truth.

## Udemy Lectures Reflected

Day 11 starts at Lecture 110 in the Udemy curriculum.

- [Lecture 110 - Day (11) Plan | خطة اليوم الحادي عشر](./lecture-110-day-11-plan.md)
- [Lecture 111 - File Upload Architecture | معمارية رفع الملفات](./lecture-111-file-upload-architecture.md)
- [Lecture 112 - Setting Up DigitalOcean Spaces | إعداد مساحة التخزين](./lecture-112-setting-up-digitalocean-spaces.md)
- [Lecture 113 - Upload Service and File Validation | خدمة رفع الملفات والتحقق من الملفات](./lecture-113-upload-service-and-file-validation.md)
- [Lecture 114 - Prepare the Resume Snapshot | تجهيز بيانات السيرة الذاتية](./lecture-114-save-resume-snapshot.md)
- [Lecture 115 - Upload Resume from Apply Form | رفع السيرة الذاتية من نموذج التقديم](./lecture-115-upload-resume-from-apply-form.md)
- [Lecture 116 - Mark Screening as Pending | تجهيز حالة التقييم](./lecture-116-mark-screening-pending.md)
- [Lecture 117 - Display Resume and Screening State in Admin | عرض السيرة وحالة التقييم في لوحة الإدارة](./lecture-117-display-resume-and-screening-state-in-admin.md)
- [Lecture 118 - Extract Resume Text from PDF | استخراج النص من السيرة الذاتية](./lecture-118-extract-resume-text-from-pdf.md)
- [Lecture 119 - Automated Screening Architecture | معمارية التقييم التلقائي](./lecture-119-automated-screening-architecture.md)
- [Lecture 120 - Publish a Screening Job After Apply | نشر مهمة التقييم بعد التقديم](./lecture-120-publish-screening-job.md)
- [Lecture 121 - The Screening Worker Route | مسار عامل التقييم](./lecture-121-screening-worker-route.md)
- [Lecture 122 - Make the Worker Idempotent | جعل العامل آمناً للتكرار](./lecture-122-idempotent-worker.md)
- [Lecture 123 - OpenAI Screening Service | خدمة التقييم باستخدام OpenAI](./lecture-123-openai-screening-service.md)
- [Lecture 124 - Store AI Screening Results | حفظ نتائج التقييم الذكي](./lecture-124-store-ai-screening-results.md)
- [Lecture 125 - Model Screening Failures | نمذجة أخطاء التقييم](./lecture-125-model-screening-failures.md)
- [Lecture 126 - Show Screening Status to Humans | عرض حالة التقييم للمستخدمين](./lecture-126-screening-status-ui.md)
- [Lecture 127 - Feature Branch for Day (11) | برانش جيتهاب لليوم الحادي عشر](./lecture-127-feature-branch.md)
- [Lecture 128 - Recap Day (11) | ملخص اليوم الحادي عشر](./lecture-128-recap.md)

## Course Position

Day 10 ended with authentication, user profiles, protected Server Actions, and protected admin pages. Day 11 should build on that by making job applications feel real.

The current pain to show first:

- `JobApplyForm` displays a resume drop area, but it does not upload anything.
- `Application` has resume-related fields, but no upload pipeline exists.
- `aiScore` is currently a placeholder value.
- Admin users can see applications, but the screening data is not meaningful yet.
- The AI screening section is expected to integrate with OpenAI rather than remain a mock forever.

## Proposed Lessons

### Lecture 110 - Day (11) Plan

Introduce the day as one connected feature:

```txt
fake resume upload
  -> real object storage upload
  -> resume metadata on applications
  -> admin resume visibility
  -> resume text extraction
  -> AI screening score and summary
```

Show the fake upload problem as part of the planning:

- `JobApplyForm` says "DROP FILE HERE", but it is static UI.
- The form submits text fields only.
- The Server Action does not receive a `File`.
- The application document cannot point to a real resume file.
- AI screening cannot happen until we can upload and read a resume.

Teaching point:

> Day 11 turns the apply flow from a form demo into a real hiring workflow. The fake upload problem is the reason for the storage and screening architecture.

### Lecture 111 - File Upload Architecture

Explain the full upload flow before coding, including why the fake upload UI is not enough:

```txt
JobApplyForm
  -> submit form + PDF file (one request)
  -> apply Server Action authenticates + validates the file
  -> server uploads PDF to private Spaces, gets object key
  -> application service saves key/metadata
  -> MongoDB metadata + PENDING screening state
```

Teaching point:

> Uploading a file is a workflow across UI, server actions, storage, and database metadata.

### Lecture 112 - Setting Up DigitalOcean Spaces

Explain why files should not be stored directly inside MongoDB documents, then set up the object storage service.

Recommended for this project:

- Use S3-compatible object storage, preferably DigitalOcean Spaces since the app is already deployed on DigitalOcean.
- Keep uploaded files out of MongoDB.
- Store only file metadata and the resume URL/key in MongoDB.
- Create the storage bucket/space.
- Add deployment/local environment variables.

Likely environment variables:

```txt
DO_SPACES_ENDPOINT
DO_SPACES_REGION
DO_SPACES_BUCKET
DO_SPACES_ACCESS_KEY_ID
DO_SPACES_SECRET_ACCESS_KEY
DO_SPACES_PUBLIC_URL
```

Resumes remain private. The server uploads them using the S3 client; downloads use short-lived signed GET URLs. Bucket CORS is not needed for the server-proxied flow. `DO_SPACES_PUBLIC_URL` records the enabled CDN/base URL but is not the authorization mechanism for private resumes.

Teaching point:

> MongoDB stores application data. Object storage stores files. Storage setup is infrastructure, so code should read it from environment variables.

### Lecture 113 - Upload Service and File Validation

Proposed files:

```txt
lib/storage.ts
services/uploads/uploads.service.ts
services/uploads/uploads.validation.ts
```

Responsibilities:

- Validate PDF content type and a 5 MB maximum.
- Generate a safe, server-owned object key.
- Upload the file bytes to private Spaces (`PutObject`).
- Generate short-lived signed GET URLs for admin downloads.
- Return a serializable result: `{ key, fileName, fileSize, contentType }`.

Teaching point:

> Keep provider-specific upload code behind a service so the application flow does not care which storage vendor we use.

### Lecture 114 - Prepare the Resume Snapshot

One win: prepare optional, migration-safe fields before the form starts filling them.

```txt
candidateResumeKey
candidateResumeFileName
candidateResumeSize
candidateResumeContentType
```

Teaching point:

> Prepare the data shape before wiring the form that fills it. Keep fields optional so legacy applications still load.

### Lecture 115 - Upload Resume from Apply Form

Update the apply flow:

```txt
JobApplyForm (normal useActionState form)
  -> submits form fields + PDF file in one request
  -> apply Server Action reads the File from FormData
  -> applyToJob service validates + uploads it
  -> fills the snapshot prepared in Lecture 114
```

Raise `serverActions.bodySizeLimit` in `next.config.ts` so a 5 MB PDF is accepted.

Teaching point:

> The file is just another form field. The Server Action validates, uploads, and saves it—no extra route or client upload handshake.

### Lecture 116 - Mark Screening as Pending

One win: introduce `screeningStatus` and start new applications at `PENDING`; remove the fake `aiScore: 0`.

Teaching point:

> A missing score is not a score of zero. Async work needs an honest status field from day one.

### Lecture 117 - Display Resume and Screening State in Admin

Add the deferred `createResumeDownloadUrl` helper, then let admins:

- Open the private resume via a fresh short-lived signed GET URL.
- See the screening status (Waiting / Screening / Ready / Failed).
- Handle missing-resume (legacy) records without crashing.

Teaching point:

> Hiding a button is UX. Checking admin role in the route is security.

### Lecture 118 - Extract Resume Text from PDF

Introduce resume parsing as a separate step before AI screening.

```txt
private resume object key
  -> extraction service
  -> plain text
  -> AI screening input
```

Teaching point:

> AI screening needs text. A PDF upload and a text prompt are not the same thing.

### Lecture 119 - Automated Screening Architecture

Design lesson (no code): why screening should be durable background work, not inline.

```txt
applyToJob -> save PENDING -> enqueue -> respond fast
queue -> worker -> extract text -> OpenAI -> COMPLETED/FAILED
```

Decide the durable queue provider (recommended shape: a signed HTTP queue such as QStash).

Teaching point:

> Automatic does not mean inline. A queue separates candidate latency from expensive AI work.

### Lecture 120 - Publish a Screening Job After Apply

One win: after saving the application, publish `{ applicationId }` to the queue and return success. Handle the dual-write problem simply.

Teaching point:

> Queue messages carry identifiers; workers reload trusted state.

### Lecture 121 - The Screening Worker Route

One win: a protected `app/api/screening/process/route.ts` that verifies the provider signature, validates the payload, and hands off. No login cookie.

Teaching point:

> The worker trusts a provider signature, not a login cookie — the caller is a server.

### Lecture 122 - Make the Worker Idempotent

One win: add status repository methods and an atomic claim so duplicate deliveries never double-screen.

Teaching point:

> At-least-once delivery means the consumer must be idempotent.

### Lecture 123 - OpenAI Screening Service

Implement the OpenAI call and force the result into a structured, zod-validated shape.

Output: `score`, `summary`, `strengths`, `risks`. Input: job title/description/requirements, extracted resume text, cover letter (minimal personal data).

Teaching point:

> Structured output turns probabilistic text into a contract the app can validate.

### Lecture 124 - Store AI Screening Results

Persist the validated result and transition `PROCESSING -> COMPLETED` atomically.

```txt
aiScore, aiSummary, aiStrengths[], aiRisks[], screenedAt
screeningStatus: PENDING | PROCESSING | COMPLETED | FAILED
```

Teaching point:

> Persist status and result together so the database never claims completion without data.

### Lecture 125 - Model Screening Failures

Make failure honest in code: the state machine, retryable vs non-retryable classification, safe error storage, and queue retries.

Teaching point:

> Async work needs states, not a loading boolean. Screening failure is not application failure.

### Lecture 126 - Show Screening Status to Humans

Turn those states into UI: admin badges + optional retry, and a calm candidate confirmation that never waits on the AI.

Teaching point:

> Same events, audience-appropriate detail: admins see the machine; candidates see "done."

### Lecture 127 - Feature Branch for Day (11)

Create the Day 11 branch, validate the feature, open the PR, and merge into the development flow.

Teaching point:

> A production feature is not done until it is reviewed, merged, and tested in the deployment workflow.

### Lecture 128 - Recap Day (11)

Recap object storage vs database, server-proxied upload, the resume snapshot, admin resume display, text extraction, the queue/worker/idempotency trio, the OpenAI service, result persistence, and failure states.

Teaching point:

> Day 11 connects file infrastructure and AI features into one application workflow.

## Expected End State

- Candidates upload a resume during application.
- Uploaded files are stored outside MongoDB.
- Application documents store resume object keys and metadata.
- Admin applications table opens resumes through short-lived signed GET URLs.
- Admin can view an automatically generated AI screening score/summary.
- OpenAI is integrated behind the screening service.
- Screening fields are persisted on the application.

## Open Decisions

- Durable queue provider (recommended shape: signed HTTP queue such as QStash).
- Which OpenAI model to use for the first version.
- Which current Node-compatible PDF parser to use; OCR remains future work.
- Whether to use strict structured outputs/JSON schema or prompt-based JSON parsing for the screening response.

## Production Notes

- Never store large files in MongoDB documents.
- Validate file type and size on the server, not just the client.
- Keep resumes private: upload through the server and generate short-lived signed GET URLs for downloads.
- Keep OpenAI prompts and provider calls in a service layer.
- Store `OPENAI_API_KEY` only in server-side environment variables.
- Do not send unnecessary personal data to OpenAI; only send what the screening task needs.
- Validate and normalize OpenAI responses before saving them to MongoDB.
- Use durable queue/pub-sub screening so file parsing and OpenAI calls do not block the candidate apply request.
- Treat AI scoring as assistant data, not a final hiring decision.
