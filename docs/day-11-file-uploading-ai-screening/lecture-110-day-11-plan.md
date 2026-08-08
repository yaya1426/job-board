# Lecture 110 - Day (11) Plan | خطة اليوم الحادي عشر

## Goal

Introduce Day 11 as one connected first-version workflow: upload a private resume, save its metadata, screen it synchronously with OpenAI after the application is persisted, and show the result to admins.

## Explain It Simply (For Beginners)

Right now our apply form has a *pretty box that pretends to accept a file* but does nothing. By the end of Day 11, a candidate can attach a real PDF resume, and an AI quietly reads it and gives admins a helpful summary and score.

Think of it like handing a document to a clerk:

- The **candidate** submits a resume.
- We put it in a **private filing cabinet** (DigitalOcean Spaces).
- We save the application first as `PENDING` (MongoDB).
- During that same request, the server asks OpenAI to analyze the resume and records `COMPLETED` or `FAILED`.
- The **admin** later reads the saved result.

The big idea students should leave with: this is *not* only "add a file input." It is a small pipeline across storage, database, application orchestration, and AI.

### Jargon decoder

- **Metadata** = data *about* the file (its name, size, type, and where it's stored), not the file's actual bytes.
- **Synchronous screening** = the apply request stays open while the AI runs. It is the simplest fully functional version, but it adds latency and timeout risk.
- **Screening** = the AI reading the resume against the job and producing a score + summary. It *assists* admins; it does not auto-reject anyone.
- **Private storage** = files nobody can open without a temporary, signed permission link.

## Current State to Show

- `JobApplyForm` contains a visual “DROP FILE HERE” area, but no file input.
- `handleApplyToJob` receives text fields only.
- `ApplicationModel.candidateResume` is only a string placeholder.
- `aiScore` is saved as `0`; there is no real screening.
- DigitalOcean Space is provisioned.
- `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` are installed.
- Upload and OpenAI Files/Responses code do not exist yet.

## Recording Steps

1. Open a job details page and point to the fake resume area.
2. Submit or inspect the current form and show that no `File` reaches the Server Action.
3. Open the application model and point to the placeholder resume field.
4. Open the application service and point to `aiScore: 0`.
5. Explain the target flow:

```txt
Candidate selects resume
  -> apply form submits the file with the application (one request)
  -> server validates the file and uploads it to private DigitalOcean Spaces
  -> application saves resume key + metadata
  -> application is marked screeningStatus=PENDING
  -> application is saved first with screeningStatus=PENDING
  -> the same apply service marks it PROCESSING
  -> the service reads the private PDF from Spaces
  -> the service uploads a temporary OpenAI file with one-hour expiration
  -> Responses API analyzes file_id + job context
  -> the temporary OpenAI file expires automatically
  -> application becomes COMPLETED or FAILED
  -> the apply request returns application success
  -> admin opens resume via a short-lived signed download URL and sees the screening result
```

6. Explain the three storage boundaries:

```txt
DigitalOcean Spaces -> actual resume file
MongoDB              -> application, file metadata, screening result/status
OpenAI               -> produces structured screening output
```

7. Preview Lectures 111–125 from the Day 11 `README.md`.

## Key Teaching Lines

> We currently have upload design, not upload behavior.

> Day 11 is not “add a file input.” It is a pipeline across storage, database, application orchestration, and AI.

> Screening is automatic. Admins review results; they do not manually start every screening.

> This first version deliberately keeps the request open while OpenAI runs. Day 16 starts from the latency, timeout, burst, and stranded-state problems this creates.

## End State

Students understand the problem, the final workflow, and why the day needs multiple layers.

## Next

Lecture 111 maps the file upload architecture and chooses simple server-proxied uploads for private resumes (with presigned direct upload named as a future scaling upgrade).
