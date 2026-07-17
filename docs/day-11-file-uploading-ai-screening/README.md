# Day 11 - File Uploading and AI Screening

## Goal

Turn the fake resume UI and static AI score into a private, asynchronous application workflow: candidates upload a PDF directly to DigitalOcean Spaces with a signed URL, MongoDB stores the object metadata, and a durable worker screens the application through OpenAI.

## Planning Status

Infrastructure setup has started, but the application pipeline is not implemented yet.

Current audited state on `develop`:

- DigitalOcean Space was provisioned externally.
- S3 client and presigner dependencies are installed in the working tree.
- `.env.local` contains the six existing `DO_SPACES_*` variables, including `DO_SPACES_PUBLIC_URL`; deployment settings still need verification.
- `OPENAI_API_KEY` is not present yet, which is expected before Lecture 120.
- Storage client, presign route, resume input, metadata persistence, PDF extraction, queue worker, and OpenAI integration are not implemented.
- The lesson files below are the instructor-ready source of truth.

## Udemy Lectures Reflected

Day 11 starts at Lecture 110 in the Udemy curriculum.

- [Lecture 110 - Day (11) Plan | خطة اليوم الحادي عشر](./lecture-110-day-11-plan.md)
- [Lecture 111 - File Upload Architecture | معمارية رفع الملفات](./lecture-111-file-upload-architecture.md)
- [Lecture 112 - Setting Up DigitalOcean Spaces | إعداد مساحة التخزين](./lecture-112-setting-up-digitalocean-spaces.md)
- [Lecture 113 - Upload Service and File Validation | خدمة رفع الملفات والتحقق من الملفات](./lecture-113-upload-service-and-file-validation.md)
- [Lecture 114 - Upload Resume from Apply Form | رفع السيرة الذاتية من نموذج التقديم](./lecture-114-upload-resume-from-apply-form.md)
- [Lecture 115 - Save Resume Metadata and Pending Screening | حفظ بيانات السيرة وتجهيز التقييم](./lecture-115-save-resume-metadata-and-pending-screening.md)
- [Lecture 116 - Display Resume and Screening State in Admin | عرض السيرة وحالة التقييم في لوحة الإدارة](./lecture-116-display-resume-and-screening-state-in-admin.md)
- [Lecture 117 - Extract Resume Text from PDF | استخراج النص من السيرة الذاتية](./lecture-117-extract-resume-text-from-pdf.md)
- [Lecture 118 - Automated Screening Architecture | معمارية التقييم التلقائي](./lecture-118-automated-screening-architecture.md)
- [Lecture 119 - Create Screening Job After Apply | إنشاء مهمة التقييم بعد التقديم](./lecture-119-create-screening-job-after-apply.md)
- [Lecture 120 - OpenAI Screening Service | خدمة التقييم باستخدام OpenAI](./lecture-120-openai-screening-service.md)
- [Lecture 121 - Store AI Screening Results | حفظ نتائج التقييم الذكي](./lecture-121-store-ai-screening-results.md)
- [Lecture 122 - Screening Status and Failure States | حالات التقييم ومعالجة الأخطاء](./lecture-122-screening-status-and-failure-states.md)
- [Lecture 123 - Feature Branch for Day (11) | برانش جيتهاب لليوم الحادي عشر](./lecture-123-feature-branch.md)
- [Lecture 124 - Recap Day (11) | ملخص اليوم الحادي عشر](./lecture-124-recap.md)

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
  -> request signed PUT URL
  -> upload PDF directly to private Spaces
  -> submit object key/metadata
  -> application service
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

Resumes remain private. Uploads and downloads use short-lived signed URLs. `DO_SPACES_PUBLIC_URL` records the enabled CDN/base URL but is not the authorization mechanism for private resumes.

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
- Validate max size.
- Generate a safe object key.
- Generate short-lived signed PUT/GET URLs.
- Return a serializable result: `{ key, uploadUrl, fileName, fileSize, contentType }`.

Teaching point:

> Keep provider-specific upload code behind a service so the application flow does not care which storage vendor we use.

### Lecture 114 - Upload Resume from Apply Form

Update the apply flow:

```txt
JobApplyForm
  -> requests signed upload
  -> uploads PDF directly to Spaces
  -> sends key/metadata through handleApplyToJob
  -> applyToJob service saves application
```

Teaching point:

> The file travels through the same Server Action flow, but it needs special validation and storage before saving the application.

### Lecture 115 - Save Resume Metadata and Pending Screening

Likely model/type updates:

- `Application.candidateResumeKey`
- optional `Application.candidateResumeFileName`
- optional `Application.candidateResumeSize`
- optional `Application.candidateResumeContentType`
- `Application.screeningStatus = PENDING`

Teaching point:

> The application should store a snapshot of the resume and immediately mark screening as pending, because screening is now part of the apply workflow.

### Lecture 116 - Display Resume and Screening State in Admin

Update admin application UI so admins can:

- See whether a resume exists.
- Open/download the resume.
- See the initial screening state (`PENDING`) before the AI result exists.
- Understand missing resume, pending screening, or upload failure states clearly.

Teaching point:

> Admins should see that screening is in progress instead of wondering why a score is missing.

### Lecture 117 - Extract Resume Text from PDF

Introduce resume parsing as a separate step before AI screening.

Possible flow:

```txt
private resume object key
  -> extraction service
  -> plain text
  -> AI screening input
```

Teaching point:

> AI screening needs text. A PDF upload and a text prompt are not the same thing.

### Lecture 118 - Automated Screening Architecture

Start problem-first:

- Admins receive many applications.
- Reading every resume manually is slow.
- The app should start screening automatically after an application is submitted.
- The candidate apply request should not become slow or fragile because OpenAI/PDF processing takes time.

Proposed files:

```txt
lib/openai.ts
services/screening/screening-queue.service.ts
services/screening/screening.service.ts
services/screening/screening.validation.ts
```

Target production flow:

```txt
applyToJob
  -> save application with screeningStatus = PENDING
  -> publish application.created / create screening job
  -> worker consumes job
  -> extract resume text
  -> call OpenAI
  -> update application with result
```

Implementation uses a durable queue/pub-sub worker. Do not rely on an un-awaited, fire-and-forget promise after the application response.

Expected AI provider:

- Use the OpenAI API for the first real screening integration.
- Keep OpenAI setup in a small `lib/openai.ts` client/config file.
- Keep prompt construction and response parsing inside `services/screening/`.
- Read the API key from `OPENAI_API_KEY`; never expose it to the browser.

Teaching point:

> Screening is automatic product behavior, but expensive AI work should eventually move behind a queue so applying stays fast and reliable.

### Lecture 119 - Create Screening Job After Apply

Wire the application creation flow to trigger screening without requiring an admin click.

```txt
applyToJob
  -> save application
  -> durably publish application.created
  -> worker processes application.id
```

The queue message contains only the application id; the worker reloads trusted data.

Teaching point:

> The apply flow should request screening, not perform all screening work inline.

### Lecture 120 - OpenAI Screening Service

Implement the OpenAI screening call and force the result into a structured application-friendly shape.

Expected output:

- score
- summary
- strengths
- risks

Possible input:

- job title
- job description
- job requirements
- extracted resume text
- candidate cover letter

Teaching point:

> OpenAI is the provider, but the app should depend on our screening service, not directly on provider calls spread across components/actions.

### Lecture 121 - Store AI Screening Results

Possible fields on `Application`:

```txt
aiScore
aiSummary
aiStrengths[]
aiRisks[]
screeningStatus: PENDING | PROCESSING | COMPLETED | FAILED
screenedAt
```

Teaching point:

> AI output should be persisted with status and timestamps, not treated as a temporary UI calculation.

### Lecture 122 - Screening Status and Failure States

Handle:

- pending screening
- completed screening
- failed screening
- retry option if appropriate
- admin UI state while screening is pending
- candidate apply success even if screening is still running

Teaching point:

> AI and file processing can fail. The admin UI should show the state instead of pretending everything is instant.

### Lecture 123 - Feature Branch for Day (11)

Create the Day 11 branch, validate the feature, open the PR, and merge into the development flow.

Teaching point:

> A production feature is not done until it is reviewed, merged, and tested in the deployment workflow.

### Lecture 124 - Recap Day (11)

Recap:

- object storage vs database
- upload service
- resume metadata
- admin resume display
- text extraction
- automated screening architecture
- screening job trigger after apply
- OpenAI screening service
- screening persistence and failure states

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
- Keep resumes private and generate short-lived signed PUT/GET URLs.
- Keep OpenAI prompts and provider calls in a service layer.
- Store `OPENAI_API_KEY` only in server-side environment variables.
- Do not send unnecessary personal data to OpenAI; only send what the screening task needs.
- Validate and normalize OpenAI responses before saving them to MongoDB.
- Use durable queue/pub-sub screening so file parsing and OpenAI calls do not block the candidate apply request.
- Treat AI scoring as assistant data, not a final hiring decision.
