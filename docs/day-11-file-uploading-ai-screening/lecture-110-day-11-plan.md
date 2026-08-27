# Lecture 110 - Day (11) Plan | خطة اليوم الحادي عشر

## Goal
Introduce Day 11 as one connected first-version workflow: upload a private resume, save its metadata, screen it synchronously with OpenAI after the application is persisted, and show the result to admins.

## Implementation Status
**Partial** — Most Day 11 layers exist in the repo; this lecture's "Current State" section still describes the pre-upload starting point.

## Key Files (as implemented today)
- `components/jobs/JobApplyForm.tsx`
- `services/applications/applications.service.ts`
- `services/uploads/uploads.service.ts`
- `services/screening/screening.service.ts`
- `lib/storage.ts`
- `lib/openai.ts`

## Gaps vs This Lecture (if any)
- Lecture still says the apply form has only a fake drop zone; the repo already has a real `<input type="file" name="resume">` (the dashed drop zone is commented out).
- Upload, OpenAI Files/Responses, and screening orchestration code now exist — not "do not exist yet".
- `aiScore: 0` placeholder and fire-and-forget `screenApplication()` remain; synchronous await + optional score are still pending (Lecture 122).

## As Implemented Today
Against the current repo: `JobApplyForm` includes a working PDF `<input type="file">` (not a fake drop zone). Trace the partially wired pipeline (Spaces upload → MongoDB snapshot → background screening trigger) and document remaining Lecture 122/123 gaps.

## Implementation steps
1. Open **as implemented today**: `JobApplyForm` has a real `<input type="file" name="resume" accept=".pdf">` (dashed drop zone is commented out).
2. Trace the target pipeline: form → `handleApplyToJob` → `uploadResume` → `saveNewApplication` (`PENDING`) → `screenApplication` → admin signed download.
3. Inspect `applications.service.ts` and document gaps: `aiScore: 0` placeholder and `screenApplication(...)` **without `await`**. Lecture documents synchronous await; repository currently uses fire-and-forget.
4. Name three storage boundaries: Spaces (bytes), MongoDB (metadata + screening), OpenAI (temporary analysis).
5. List lectures 111–125 from the Day 11 README.

## Background
Right now our apply form has a *pretty box that pretends to accept a file* but does nothing. By the end of Day 11, a candidate can attach a real PDF resume, and an AI quietly reads it and gives admins a helpful summary and score.

Think of it like handing a document to a clerk:

- The **candidate** submits a resume.
- We put it in a **private filing cabinet** (DigitalOcean Spaces).
- We save the application first as `PENDING` (MongoDB).
- During that same request, the server asks OpenAI to analyze the resume and records `COMPLETED` or `FAILED`.
- The **admin** later reads the saved result.

**Key idea:** this is *not* only "add a file input." It is a small pipeline across storage, database, application orchestration, and AI.

### Jargon decoder

- **Metadata** = data *about* the file (its name, size, type, and where it's stored), not the file's actual bytes.
- **Synchronous screening** = the apply request stays open while the AI runs. It is the simplest fully functional version, but it adds latency and timeout risk.
- **Screening** = the AI reading the resume against the job and producing a score + summary. It *assists* admins; it does not auto-reject anyone.
- **Private storage** = files nobody can open without a temporary, signed permission link.

## Starting point
- `JobApplyForm` contains a visual “DROP FILE HERE” area, but no file input.
- `handleApplyToJob` receives text fields only.
- `ApplicationModel.candidateResume` is only a string placeholder.
- `aiScore` is saved as `0`; there is no real screening.
- DigitalOcean Space is provisioned.
- `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` are installed.
- Upload and OpenAI Files/Responses code do not exist yet.

## Key points
> We currently have upload design, not upload behavior.

> Day 11 is not “add a file input.” It is a pipeline across storage, database, application orchestration, and AI.

> Screening is automatic. Admins review results; they do not manually start every screening.

> This first version deliberately keeps the request open while OpenAI runs. Day 16 starts from the latency, timeout, burst, and stranded-state problems this creates.

## End State
Covers the problem, the target workflow, and why the day spans storage, database, orchestration, and AI layers.

## Next
Lecture 111 maps the file upload architecture and chooses simple server-proxied uploads for private resumes (with presigned direct upload named as a future scaling upgrade).
