# Lecture 4 - Course Method: Spiral + Ship | منهج الكورس: تعلّم حلزوني وانشر باستمرار

## Goal

Explain how the project teaches: spiral learning, vertical slices, frequent shipping, and patterns introduced after concrete product pain.

## Outcome

After reading this lecture, you should understand spiral learning, vertical slices, the ship mindset, the daily engineering loop, and why architecture is revisited when product pain appears instead of being fully designed upfront.

## Implementation Status

Orientation — no code changes. Grounded in course product `wazifa.app`.

## Context

Two exhausting ways to learn product engineering: study everything theoretically before building, or add features quickly without returning to improve foundations. This course uses a third path—build a small working slice, ship it, then revisit the same concepts at greater depth when the product reveals a real reason.

## Key concepts

### Spiral learning

Meet an idea in a simple form, use it, and return later with more context and a harder problem.

```text
            Revisit with real pain
                   ↗
        Build → Verify → Ship
          ↑                 ↓
          └── Learn ← Observe
```

Contrast with a straight syllabus: authentication might be taught as one block of theory. In a spiral, the product first needs a user, then a session, then protected actions, then role checks, then more advanced security concerns.

The second visit is not duplicated content. The product has changed, so the same concept answers a richer question.

Examples:

- **Deployment** — First: one page online. Later: environment variables, domains, staging, Docker builds, safe release flow.
- **Authentication** — First: sign-up/login. Later: session-derived ownership, admin role protection, layered checks.

### Ship

**Ship** — Make a coherent increment available in its intended environment, verify the real result, and keep scope small enough to understand and repair.

Shipping is not reckless pushing. It includes review, verification, and an intentional release path.

Day 1 deploys because:

- Build and environment issues surface early.
- Every future feature is designed for life beyond localhost.
- Deployment stops being a frightening final chapter.

Deployment is part of the development cycle from the first day, not a graduation ceremony at the end.

### Vertical slices

A **vertical slice** is a thin, end-to-end piece of user value:

```text
User need → UI → server rule → data/provider → deployed verification
```

Contrast with building disconnected layers for weeks (all database abstractions, then all routes, then all pages). Instead: make one meaningful journey work through the necessary layers.

Why slices stay small:

- Easier to verify and review
- Exposes integration problems early
- Produces a visible result

The useful unit is a day or coherent increment—not necessarily every individual lecture.

### Patterns after pain

Introduce a pattern when you can see the problem it solves.

| Pattern | Pain that triggers it |
|---|---|
| Repository layer | Database details leaking into business logic |
| Background worker | Synchronous AI causing slow requests, timeouts, or burst pressure |
| Caching | Repeated or slow work measured after correctness is established |

A pattern before the problem looks like ritual memorization. After the problem, it becomes a tool whose value and cost are understood.

### Upload and AI spiral (four passes)

| Pass | Capability | Honest boundary |
|---|---|---|
| 1 — Fake upload UI | Candidate sees where a resume attaches | No claim of safe storage |
| 2 — Real private storage | Server-proxied upload to private object storage; controlled metadata; temporary admin access | Production-realistic file handling |
| 3 — Synchronous AI screening | Application saved first; structured screening in same request; `COMPLETED`/`FAILED` status; submission succeeds if screening fails | Proves the flow; not final scale architecture |
| 4 — Queued worker (Day 16) | QStash-backed processing with claims, retries, reconciliation | Addresses latency and reliability pain |

Each pass is honest about its current capability. Earlier passes are bounded steps, not wrong implementations.

### Daily engineering loop

1. Choose one product outcome
2. Create a focused feature branch (once the workflow is introduced)
3. Implement the smallest production-realistic slice
4. Review for correctness and scope
5. Verify locally
6. Deploy to the appropriate environment
7. Verify the deployed user journey
8. Capture decisions and known limitations

**Branch** isolates focused work. **Review** checks whether the change matches the intended outcome. **Verification** gathers evidence from types, lint/build checks, and real behavior.

Formal staging and branch rules arrive when the project has enough change to feel the need (Day 7). The mindset exists from the start.

### Smallest production-realistic step

Three tests before implementing:

1. Does it produce real user value or a necessary operational foundation?
2. Does it acknowledge the most relevant current risk?
3. Can you explain what is intentionally deferred?

**Not now** parking lot (revisited when evidence supports them): queue, advanced caching, multi-region deployment, separate backend.

Deferred is not forgotten.

### Supporting definitions

- **Feedback loop** — Using results and failures to guide the next decision.
- **Premature abstraction** — Creating a generalized structure before its repeated need is understood.
- **Branch** — An isolated line of Git work used to develop and review a change.
- **Worker** — A process or endpoint that performs work outside the user's immediate request.

## How this applies to wazifa.app

- **Deployment** grows from a single page to custom domains, staging, runtime configuration, and release safety.
- **Authentication** grows from sign-up/login to session-derived candidate ownership and admin role protection.
- **Resume handling** grows from placeholder UI to private DigitalOcean Spaces storage and temporary admin access.
- **AI** grows from synchronous OpenAI screening to QStash-backed processing with retries and reconciliation.
- The modular monolith remains one deployment while code boundaries become clearer as the product grows.

Example slices:

- **Jobs slice** — Display a real list from data source to public page.
- **Apply slice** — Accept one candidate submission through UI, server rules, storage, and persistence.

## Implementation steps

1. Read this lecture before starting Day 1 implementation.
2. When working through later days, note which spiral pass you are on for each concern (deployment, auth, files, AI).
3. Before adding abstraction, ask: what pain does this solve right now?
4. Follow the loop on each feature day: branch → implement → review → verify locally → deploy → verify deployed → document in the day's lecture files.
5. Review Day 7 docs ([`docs/day-07-staging-branch-rules/`](../day-07-staging-branch-rules/)) when formal branch rules are introduced.
6. Review Day 16 docs ([`docs/day-16-scalable-ai-screening/`](../day-16-scalable-ai-screening/)) for the queued-worker pass of the AI spiral.
7. Keep a personal "not now" list and revisit it when product evidence changes.

## Key points

- Meet the idea simply, use it, then revisit it with real context.
- Deployment is part of development, not the final ceremony.
- A vertical slice proves integration earlier than disconnected layers.
- Introduce patterns after you feel the problem they solve.
- Deferred does not mean forgotten.
- Choose the smallest production-realistic step.

## Verify

- [ ] You can explain spiral learning with a concrete example (deployment or auth).
- [ ] You can define Ship as release plus verification, not reckless pushing.
- [ ] You can describe a vertical slice and give a `wazifa.app` example.
- [ ] You can state the "patterns after pain" rule with an example.
- [ ] You can name all four upload/AI progression stages.
- [ ] You can outline the branch, review, verify, deploy, and observe loop.

## Out of scope

- Git commands, queue APIs, storage APIs, auth implementation, or service/repository code.
- Implying every day must deploy regardless of a broken verification result.
- Claiming synchronous AI is the final scalable architecture.
- Labeling every early implementation "production ready" without stating its limits.
- Presenting microservices as inherently advanced or monoliths as inherently basic.

## Next

[Lecture 5 — Project Overview](./lecture-005-project-overview.md)
