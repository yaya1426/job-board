# Lecture 117 - Extract Resume Text from PDF | استخراج النص من السيرة الذاتية

## Goal

Turn a private PDF object into normalized plain text that the screening service can consume.

## Dependency

Choose a Node-compatible PDF parser and install its current supported version during recording. Verify compatibility with the project’s Node runtime before committing.

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

Lecture 118 designs the automated, durable screening workflow around this extraction service.
