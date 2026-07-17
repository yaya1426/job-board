# Lecture 123 - Feature Branch for Day (11) | برانش جيتهاب لليوم الحادي عشر

## Goal

Validate, review, and deploy the completed Day 11 workflow through the course branching process.

## Explain It Simply (For Beginners)

The feature works on your laptop — great, but that's not "done." This lecture is the disciplined wrap-up: clean out experiments, prove it builds, verify every secret exists on the server too, and ship it through the team's branch → PR → staging → production flow.

The headline lesson: **"works locally" is not "works in production."** Day 11 added lots of new secrets (Spaces keys, a queue token, an OpenAI key) and external services. Any one of them missing on the deployed server breaks the feature — and you won't find out until it's live unless you check. So verifying the *environment contract* (same variable names, present in both places) is part of finishing the feature, not an afterthought.

Analogy: cooking a dish at home vs. serving it in a restaurant. Same recipe, but the restaurant kitchen needs the same ingredients stocked, the health inspection passed, and the plating consistent. The recipe working once in your kitchen isn't the finish line.

Also important: **don't commit secrets.** Never let `.env.local`, access keys, the OpenAI key, or test resumes into git. And remove the tutorial leftovers — like that `app/api/jobs/route.ts` "Hello, world" placeholder and any temporary `console.log`s.

### Jargon decoder

- **Environment contract** = the agreement that the same env variable *names* exist (with correct values) in every environment: local, staging, production.
- **`tsc --noEmit`** = type-checks the code without producing output — catches type errors before deploy.
- **Smoke test** = a quick manual check that the main paths work after deploying.
- **PR (pull request)** = a proposed set of changes reviewed before merging.
- **Staging** = a production-like environment for testing before real users see it.

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
