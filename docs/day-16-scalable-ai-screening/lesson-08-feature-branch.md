# Lesson 08 - Feature Branch for Day 16

## Goal

Verify and ship the durable background-screening architecture without committing secrets, load-test artifacts, synthetic resumes, or disposable routes.

## Implementation Status

**Planned — not in codebase** (QStash worker, atomic claims, async screening UX)

## Step 1 - Recheck Current Provider APIs

Before recording and before the final build, compare installed package types with current official QStash documentation:

```txt
Client.publishJSON({ url, body, retries })
verifySignatureAppRouter(handler)
QSTASH_CURRENT_SIGNING_KEY
QSTASH_NEXT_SIGNING_KEY
```

Provider APIs can change. Update lesson snippets if the installed current package differs.

## Step 2 - Inspect and Clean the Working Tree

```bash
git status --short
git diff
```

Remove:

```txt
[ ] development-only burst route
[ ] burst measurement script
[ ] temporary publisher scripts
[ ] synthetic PDFs and session cookies
[ ] raw provider responses or private data in logs
[ ] hard-coded URLs, tokens, signing keys, or application IDs
```

## Step 3 - Verify Environment Variables

Day 16 requires the existing Spaces/OpenAI values plus:

```txt
QSTASH_TOKEN
QSTASH_CURRENT_SIGNING_KEY
QSTASH_NEXT_SIGNING_KEY
APP_BASE_URL
```

Checks:

- all values are server-only
- staging URL is publicly reachable by QStash
- production uses production token/signing keys and origin
- local tunnel URLs are temporary and not committed
- both current and next signing keys are present

## Step 4 - Run Static Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Step 5 - Run the Staging Test Matrix

```txt
[ ] application persists before publish
[ ] candidate response returns before screening completes
[ ] payload contains only applicationId
[ ] unsigned route request is rejected
[ ] malformed signed payload is rejected
[ ] valid delivery atomically claims PENDING -> PROCESSING
[ ] duplicate delivery is skipped
[ ] successful analysis stores COMPLETED result
[ ] retryable provider failure returns to PENDING and is redelivered
[ ] permanent input failure stores FAILED safe message
[ ] temporary OpenAI files use one-hour expires_after on success and failure
[ ] publish failure leaves submitted application in PENDING
[ ] reconciliation republishes old PENDING records
[ ] stale PROCESSING record returns to PENDING
[ ] candidate never receives provider errors
[ ] admin optional retry is role-protected and state-guarded
```

Use synthetic data and low volume. Never perform the burst demonstration against production.

## Step 6 - Create the Feature Branch

```bash
git switch -c feature/day-16-scalable-ai-screening
git add .
git status --short
git commit -m "move AI screening to durable background processing"
git push -u origin feature/day-16-scalable-ai-screening
```

These are course follow-along commands. Review the staged list before committing and remove secrets/test artifacts.

Open a pull request into `development`, review all commits and checks, then deploy staging.

## Step 7 - Observe the Staging Deployment

1. Submit one synthetic application.
2. Confirm the response is fast and status begins `PENDING`.
3. Inspect QStash delivery status and attempts.
4. Observe `PROCESSING -> COMPLETED`.
5. Open the admin result and private resume.
6. Confirm the temporary OpenAI file reports an `expires_at` about one hour after creation and later expires automatically.
7. Test one controlled retryable failure.
8. Test reconciliation with one controlled stale record.
9. Confirm logs contain IDs and safe messages, not resume content or PII.

Promote only after the matrix passes.

## Next

Lesson 09 recaps the migration from measured synchronous pain to durable background processing.
