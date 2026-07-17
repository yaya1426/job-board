# Lecture 123 - Feature Branch for Day (11) | برانش جيتهاب لليوم الحادي عشر

## Goal

Validate, review, and deploy the completed Day 11 workflow through the course branching process.

## Step 1 - Review Working Tree

Check:

```bash
git status
git diff
```

Do not commit `.env.local`, access keys, OpenAI keys, queue tokens, or generated test resumes.

## Step 2 - Remove Tutorial Experiments

Before committing:

- remove placeholder/debug API routes such as an unused “Hello, world” route
- remove temporary logging
- remove hardcoded credentials/URLs
- remove test-only public ACLs
- ensure old fake resume UI is gone

## Step 3 - Run Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Manual test matrix:

```txt
valid PDF
invalid type
file over 5 MB
candidate upload/apply
admin private resume access
pending -> completed screening
failed screening state
unauthorized resume access
duplicate queue delivery
```

## Step 4 - Verify Environment Contracts

Development deployment needs:

```txt
DO_SPACES_ENDPOINT
DO_SPACES_REGION
DO_SPACES_BUCKET
DO_SPACES_ACCESS_KEY_ID
DO_SPACES_SECRET_ACCESS_KEY
queue provider variables
OPENAI_API_KEY
worker callback/base URL
```

Confirm CORS includes the development origin.

## Step 5 - Branch and PR

Follow the repository’s established workflow:

```txt
day-11/feature branch
  -> pull request to develop
  -> staging deployment
  -> smoke test
  -> release PR to production branch when approved
```

Use the exact branch naming convention currently used by the course repository.

## Step 6 - Production Review

- separate development and production Space/bucket
- private objects
- production CORS origins
- queue webhook verification
- production OpenAI limits/budget
- no staging indexing or secret leakage

## Key Teaching Lines

> The feature is not finished when it works locally; it is finished when its infrastructure contract works in staging.

> Upload and AI features add secrets and external services, so deployment verification is part of implementation.

## Next

Lecture 124 recaps the complete Day 11 architecture and remaining production hardening.
