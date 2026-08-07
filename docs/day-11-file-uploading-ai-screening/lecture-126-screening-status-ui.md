# Lecture 126 - Show Screening Status to Humans | عرض حالة التقييم للمستخدمين

## Goal

One small win: turn the honest states from Lecture 125 into clear UI — badges for admins, a calm success message for candidates — so nobody stares at a mystery spinner.

## Explain It Simply (For Beginners)

We modeled failure honestly in code; now we *show* it. Two different audiences need two different things:

- **Admins** want to know exactly where each application stands — waiting, screening, ready, or failed — and occasionally to retry a failed one.
- **Candidates** should just feel "my application went through." They should never wait on the AI or see our internal errors.

Analogy: package tracking. The customer sees "Order confirmed." The warehouse dashboard sees "picking → packing → shipped → delivery failed → retry." Same events, audience-appropriate detail.

### Jargon decoder

- **Badge** = a small colored label showing a status at a glance.
- **Recovery action** = an admin-only button (like "retry") used to fix a stuck/failed job — not the normal trigger.
- **Optimistic confirmation** = telling the candidate "submitted!" as soon as the application is saved/queued, without waiting for the AI.

## Step 1 - Build Admin Status UX

- pending badge
- processing badge/spinner
- completed result
- failed message
- optional authorized retry action

Even though screening is automatic, a retry operation can be an admin **recovery** tool; it is not the normal trigger.

## Step 2 - Candidate UX

Application submission should confirm success once the application is saved/queued. Candidates should not wait for, or ever see, internal AI errors during submission.

## Verification

- Admin sees the correct status for pending, processing, completed, and failed applications.
- A failed application shows a clear message (and optional retry) without exposing internal error details.
- The candidate's submission confirms immediately, independent of screening progress.
- A stale `PROCESSING` state is detectable in the admin view.

## Key Teaching Lines

> Show the state, don't fake instant success.

> Same events, audience-appropriate detail: admins see the machine; candidates see "done."

## Next

Lecture 127 returns to the original resume mockup and makes its dashed drop zone fully functional.
