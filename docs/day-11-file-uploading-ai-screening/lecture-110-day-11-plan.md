# Lecture 110 - Day (11) Plan | خطة اليوم الحادي عشر

## Goal

Introduce Day 11 as one connected production workflow: upload a private resume, save its metadata, process it asynchronously, screen it with OpenAI, and show the result to admins.

## Current State to Show

- `JobApplyForm` contains a visual “DROP FILE HERE” area, but no file input.
- `handleApplyToJob` receives text fields only.
- `ApplicationModel.candidateResume` is only a string placeholder.
- `aiScore` is saved as `0`; there is no real screening.
- DigitalOcean Space is provisioned.
- `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` are installed.
- Upload, queue, PDF parsing, and OpenAI code do not exist yet.

## Recording Steps

1. Open a job details page and point to the fake resume area.
2. Submit or inspect the current form and show that no `File` reaches the Server Action.
3. Open the application model and point to the placeholder resume field.
4. Open the application service and point to `aiScore: 0`.
5. Explain the target flow:

```txt
Candidate selects resume
  -> app requests a short-lived signed upload URL
  -> browser uploads directly to private DigitalOcean Spaces
  -> application saves resume key + metadata
  -> application is marked screeningStatus=PENDING
  -> application.created screening job is queued
  -> worker extracts PDF text
  -> worker calls OpenAI
  -> application becomes COMPLETED or FAILED
  -> admin sees resume and screening result
```

6. Explain the three storage boundaries:

```txt
DigitalOcean Spaces -> actual resume file
MongoDB              -> application, file metadata, screening result/status
OpenAI               -> produces structured screening output
```

7. Preview Lectures 111–124 from the Day 11 `README.md`.

## Key Teaching Lines

> We currently have upload design, not upload behavior.

> Day 11 is not “add a file input.” It is a pipeline across storage, database, background processing, and AI.

> Screening is automatic. Admins review results; they do not manually start every screening.

## End State

Students understand the problem, the final workflow, and why the day needs multiple layers.

## Next

Lecture 111 maps the file upload architecture and chooses direct presigned uploads for private resumes.
