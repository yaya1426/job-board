# Lecture 124 - Recap Day (11) | ملخص اليوم الحادي عشر

## Goal

Review the complete resume upload and automated AI screening pipeline, reinforcing boundaries and production trade-offs.

## Final Workflow

```txt
Candidate
  -> requests signed PUT URL
  -> uploads private PDF directly to Spaces
  -> submits application with object key/metadata

Application service
  -> saves application as PENDING
  -> publishes application.created
  -> returns success

Screening worker
  -> claims PROCESSING
  -> reads private PDF
  -> extracts text
  -> calls OpenAI for structured output
  -> saves COMPLETED or FAILED

Admin
  -> receives short-lived signed GET URL
  -> views resume and screening result/status
```

## Concepts to Recap

### Object Storage

- file bytes belong in Spaces
- application metadata belongs in MongoDB
- private objects use temporary signed URLs

### Validation and Security

- browser validation is UX
- server validates metadata/auth
- keys are generated server-side
- secrets never reach the browser

### Application Snapshot

- resume key/name/size/type are stored on the application
- missing AI score is not score zero
- new applications begin `PENDING`

### Background Processing

- automatic does not mean inline
- queue delivery must be durable
- worker must be idempotent
- application success is separate from screening success

### OpenAI

- server-only client
- minimal personal data
- structured, zod-validated output
- decision support, not automatic hiring judgment

### Operational States

```txt
PENDING -> PROCESSING -> COMPLETED
                      -> FAILED -> retry
```

## Current/Future Hardening to Mention

- orphan upload cleanup
- upload ownership records or `HeadObject` verification
- transactional outbox for DB + queue consistency
- OCR for scanned PDFs
- stuck-job reconciliation
- retention/deletion policy for resumes
- OpenAI cost/rate monitoring

## Student Checklist

Students should be able to explain:

1. Why resumes should not be public MongoDB fields/blobs.
2. Why presigned direct upload is useful.
3. Why the object key is stored instead of a signed URL.
4. Why screening should run through a queue.
5. Why workers must be idempotent.
6. Why AI output must be structured and validated.
7. Why screening failure does not invalidate the application.

## Closing Line

> Day 11 turns one fake upload box into a secure, asynchronous, observable hiring pipeline.

## Next Day

Day 12 makes public and admin lists scalable with search, filters, sorting, and pagination.
