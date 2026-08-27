# Lecture 124 - Feature Branch for Day (11) | برانش جيتهاب لليوم الحادي عشر

## Goal
Review, verify, and ship the completed private-upload and synchronous-screening workflow without committing secrets, test resumes, or disposable probes.

## Implementation Status
**Planned** — Git workflow documentation; verify against actual branch state in this repository.

## Key Files (as implemented today)
- `docs/day-11-file-uploading-ai-screening/`

## Gaps vs This Lecture (if any)
- Several Lecture 122/123 gaps above should be closed or documented before calling Day 11 "complete" in recap.

## Implementation steps
See steps below (Step 1–7). Summary:

1. `git status` / `git diff` — ensure no `.env.local`, API keys, or test PDFs staged.
2. Remove disposable smoke routes, hard-coded file IDs, fake score fallbacks.
3. Verify env contract locally and on DigitalOcean: all `DO_SPACES_*` + `OPENAI_*` (+ `MONGO_URI`, `NEXTAUTH_*`).
4. Run `npm run lint`, `npx tsc --noEmit`, `npm run build`.
5. Manual test matrix: valid PDF apply, oversize/non-PDF rejection, admin resume download via `/dashboard/applications/[id]/resume`, screening states.
6. Document known gaps before merge: `screenApplication` without `await`, `aiScore: 0` placeholder, duplicate-application TODO.
7. Branch `feature/day-11-file-uploading-ai-screening` → PR to `development`.

## Step 1 - Inspect the Working Tree
```bash
git status --short
git diff
```

Confirm `.env.local`, API keys, downloaded PDFs, and test resumes are not staged.

## Step 2 - Remove temporary experiments
```txt
[ ] disposable OpenAI smoke route removed
[ ] temporary screening caller/logs removed
[ ] no hard-coded OpenAI file IDs or Spaces object keys
[ ] no raw/public resume links
[ ] no fake score or result fallback
[ ] no local PDF parser, extraction service, or OCR experiment
```

The durable OpenAI operation remains in the application code; only test surfaces are removed.

## Step 3 - Verify the Environment Contract
Local, development, and production use these server-only names:

```txt
DO_SPACES_ENDPOINT
DO_SPACES_REGION
DO_SPACES_BUCKET
DO_SPACES_ACCESS_KEY_ID
DO_SPACES_SECRET_ACCESS_KEY
OPENAI_API_KEY
OPENAI_MODEL
```

The server-proxied upload does not require browser bucket CORS. Do not add client-visible versions of these secrets.

## Step 4 - Run Automated Checks
```bash
npm run lint
npx tsc --noEmit
npm run build
```

If the production build reads required environment values, run it in an environment with safe development credentials rather than hard-coding placeholders.

## Step 5 - Run the Manual Test Matrix
```txt
[ ] valid PDF stores private Spaces metadata
[ ] non-PDF and >5 MB files fail server validation
[ ] application is persisted as PENDING before screening starts
[ ] request remains open while synchronous screening runs
[ ] successful analysis stores COMPLETED + score /10 + result + screenedAt
[ ] controlled OpenAI failure stores FAILED with a safe message
[ ] screening failure still returns application-submitted UX
[ ] duplicate submission is rejected without uploading another resume
[ ] temporary OpenAI files have expires_at about one hour after creation
[ ] temporary OpenAI files expire automatically after success or failure
[ ] admin-only signed resume route works
[ ] no-session resume request returns 401
[ ] non-admin resume request returns 403
[ ] raw private object URL remains inaccessible
```

Observe the request duration in browser DevTools. The visible wait is expected in Day 11 and becomes evidence for Day 16.

## Step 6 - Create the Branch and Commit
Adapt the branch name to the project convention:

```bash
git switch -c feature/day-11-file-uploading-ai-screening
git add .
git status --short
git commit -m "add private resume upload and AI screening"
git push -u origin feature/day-11-file-uploading-ai-screening
```

Before committing, inspect `git status --short` again and unstage any secret or local test artifact. Open a pull request into `development`, review the complete diff, and wait for checks.

These are follow-along commands for the lecture. The documentation rewrite itself does not stage or commit files.

## Step 7 - Staging Smoke Test
After the development deployment:

1. Verify all Spaces and OpenAI variables exist with server/runtime scope.
2. Submit one controlled application with a synthetic test resume.
3. Measure how long the apply request remains open.
4. Confirm the application and resume snapshot were saved before the result.
5. Confirm the final state becomes `COMPLETED`.
6. Open the private resume through the admin-only route.
7. Confirm OpenAI usage appears in the intended project.
8. Confirm the temporary file's `expires_at` is about one hour after creation; it may remain available until then.
9. Trigger one controlled provider failure and confirm the saved application becomes `FAILED` while candidate UX still says submitted.

Promote only after staging succeeds. Never generate load against production.

## Next
If the DigitalOcean Docker build cannot read the new Spaces/OpenAI variables, continue with complementary Lecture 124.1. It explains Docker build arguments, DigitalOcean variable scopes, secret rotation, and build/runtime verification.

Lecture 125 then verifies and recaps the complete Day 11 flow and records its intentional scaling limits.
