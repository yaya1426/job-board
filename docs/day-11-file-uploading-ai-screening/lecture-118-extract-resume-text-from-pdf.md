# Lecture 118 - Extract Resume Text from PDF | استخراج النص من السيرة الذاتية

## Goal

Turn a private PDF object into normalized plain text that the screening service can consume.

## Explain It Simply (For Beginners)

A PDF is not text — it's a bundle of bytes describing how to *draw* a page. But OpenAI needs actual words to read. So before we can screen a resume, we have to "unwrap" the PDF and pull the plain text out of it.

Analogy: the PDF is a sealed envelope. This lecture is the step where we open it and copy the letter's words onto a clean sheet the AI can read. We also tidy that text up ("normalize" it) — collapse weird spacing, cap the length — so we don't send a giant messy blob to OpenAI.

A critical real-world gotcha for students: **some PDFs are just pictures.** If someone scanned a paper resume, the "text" is actually an image, and a normal parser finds *nothing*. We don't pretend otherwise — we fail that case honestly with a clear error (and note that OCR could be added later). Uploading successfully does **not** guarantee readable text, so extraction gets its own error handling.

Privacy matters here too: resume text is personal. We keep it inside the pipeline — never log it, never send it back to the browser, and only pass the necessary parts to OpenAI.

### Jargon decoder

- **Parse / parser** = a tool that reads a file format and extracts structured content (here, the text out of a PDF).
- **Normalize** = clean up into a consistent shape (trim whitespace, enforce a max length).
- **Buffer / byte array** = how raw file bytes are held in memory so the parser can work on them.
- **OCR** (Optical Character Recognition) = tech that reads text *out of images* — needed for scanned PDFs, deliberately out of scope for now.
- **Error boundary** = a dedicated place to catch and handle a specific kind of failure cleanly.

## Dependency

Choose a Node-compatible PDF parser and install its current supported version during recording. Verify compatibility with the project’s Node runtime before committing.

This service uses `Buffer`, the S3 SDK stream, and a Node-compatible PDF parser. It must run in the **Node.js runtime**, not the Edge runtime. The worker route that later calls it should explicitly export:

```ts
export const runtime = "nodejs";
```

## Files Created

```txt
services/resumes/resumes.service.ts
```

## Step 1 - Fetch the Object Server-Side

Use `GetObjectCommand` with:

```txt
Bucket
Key
```

The worker/service reads the private object using server credentials; it does not need a public URL.

## Step 2 - Convert the SDK Body

Convert the response stream/body into a byte array or `Buffer` supported by the chosen parser.

Reject:

- missing object
- empty object
- unexpected content type
- object larger than the accepted limit

## Step 3 - Extract PDF Text

Create:

```ts
extractResumeText(resumeKey: string): Promise<string>
```

Responsibilities:

- fetch PDF
- parse text
- normalize whitespace
- enforce a maximum text length
- throw a safe domain error when text cannot be extracted

## Step 4 - Explain Scanned PDFs

Normal PDF parsers cannot extract text from image-only/scanned resumes. Options:

- reject with a clear failure state
- add OCR in a later enhancement
- use a document-processing provider

Do not pretend all PDFs contain extractable text.

## Step 5 - Protect Personal Data

- Do not log resume text.
- Do not return extracted text to the browser.
- Keep it inside the screening pipeline.
- Send only necessary content to OpenAI.

## Verification

- text PDF produces normalized text
- empty/scanned PDF produces a controlled error
- missing object produces a controlled error
- no resume text appears in logs/client responses

## Key Teaching Lines

> A PDF file is bytes; OpenAI screening needs text.

> Parsing can fail even when upload succeeds, so extraction needs its own error boundary.

## Next

Lecture 119 designs the automated, durable screening workflow around this extraction service.
