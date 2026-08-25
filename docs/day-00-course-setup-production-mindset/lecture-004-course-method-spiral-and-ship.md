# Lecture 4 — Course Method: Spiral + Ship | منهج الكورس: تعلّم حلزوني وانشر باستمرار

## Implementation Status

Orientation lecture — no code changes. Grounded in course product `wazifa.app`.

## Recommended duration

12–14 minutes

## Lecture outcome

Students understand spiral learning, vertical slices, daily shipping, and the branch/review/verify loop. They can explain why architecture is revisited when concrete product pain appears instead of being fully designed upfront.

## Opening hook

> “هناك طريقتان مرهقتان لتعلّم بناء المنتجات: أن تدرس كل شيء نظرياً قبل أن تبني، أو أن تضيف Features بسرعة بدون أن تعود لتحسين الأساس. هذا الكورس سيستخدم طريقاً ثالثاً.”

> “سنبني Slice صغيرة تعمل، ننشرها، ثم نعود إلى نفس المفاهيم بعمق أكبر عندما يكشف المنتج سبباً حقيقياً لذلك.”

## What to show on screen/slides

- A simple spiral diagram:

```text
            Revisit with real pain
                   ↗
        Build → Verify → Ship
          ↑                 ↓
          └── Learn ← Observe
```

- A horizontal vertical-slice diagram:

```text
User need → UI → server rule → data/provider → deployed verification
```

- A course loop slide:
  - Small branch
  - Implement
  - Review
  - Verify
  - Deploy
  - Observe
- A progression slide:
  - Fake upload UI
  - Real private storage
  - Synchronous AI screening
  - Queued worker
- A “not now” parking-lot slide for premature abstractions.

## Chronological speaking script

### 1. Define spiral learning

- Draw or reveal the spiral.
- Define it:
  - “Spiral learning means we meet an idea in a simple form, use it, and return later with more context and a harder problem.”
- Contrast with a straight syllabus:
  - A straight syllabus may try to finish “all authentication theory” in one block.
  - A spiral first needs a user, then a session, then protected actions, then role checks, then more advanced security concerns.
- Explain why repetition is intentional:
  - The second visit is not duplicated content.
  - The product has changed, so the same concept now answers a richer question.
- Example:
  - First, deployment means getting one page online.
  - Later, deployment includes environment variables, domains, staging, Docker builds, and safe release flow.
- Suggested wording:
  - “لن نقول: شرحنا deployment وانتهى. سنعود إليه كلما أصبحت مخاطره وقراراته أكثر واقعية.”

### 2. Define Ship

- Define **Ship**:
  - Make a coherent increment available in its intended environment.
  - Verify the real result.
  - Keep it small enough to understand and repair.
- Clarify that shipping is not reckless:
  - It does not mean pushing broken code directly to production.
  - It includes review, verification, and an intentional release path.
- Explain why Day 1 deploys:
  - Students feel the real build and environment early.
  - Every future feature is designed for life beyond localhost.
  - Deployment stops being a frightening final chapter.
- Key wording:
  - “النشر ليس حفلة التخرج في آخر الكورس؛ هو جزء من دورة التطوير من أول يوم.”

### 3. Introduce vertical slices

- Define a **vertical slice**:
  - A thin, end-to-end piece of user value.
- Contrast it with building disconnected layers for weeks:
  - Not “finish every database abstraction, then every backend route, then every page.”
  - Instead “make one meaningful journey work through the necessary layers.”
- Use `wazifa.app`:
  - A jobs slice could display a real list from data source to public page.
  - An apply slice can accept one candidate submission through UI, server rules, storage, and persistence.
- Explain why the slice stays small:
  - Easier to verify.
  - Easier to review.
  - Exposes integration problems early.
  - Produces a visible result.
- Do not imply every lecture ships separately; the day or coherent increment is the useful unit.

### 4. Explain “patterns after pain”

- State the rule:
  - Introduce a pattern when students can see the problem it solves.
- Example: repository layer
  - Start close to the feature.
  - Notice database details leaking into business logic.
  - Introduce a repository boundary with a clear reason.
- Example: background worker
  - First prove AI screening synchronously.
  - Observe slow requests, timeout risk, or burst pressure.
  - Then move work behind a queue and protected worker.
- Example: caching
  - First make data correct and deployed.
  - Measure repeated or slow work.
  - Then choose caching and invalidation deliberately.
- Say:
  - “الـ pattern قبل المشكلة يبدو كطقس نحفظه. بعد المشكلة يصبح أداة نفهم قيمتها وتكلفتها.”

### 5. Walk through the upload and AI spiral

- Show the four-step progression.
- **Pass 1 — Fake upload UI**
  - Candidate sees where a resume will be attached.
  - Product flow and design become visible.
  - No claim that the file is safely stored.
- **Pass 2 — Real private storage**
  - Resume travels through the server.
  - Object storage remains private.
  - Application keeps controlled resume metadata.
  - Admin receives temporary access when needed.
- **Pass 3 — Synchronous AI screening**
  - Save the application first.
  - Submit the document for structured screening in the same request.
  - Persist completed or failed status.
  - Keep the submission successful if optional screening fails.
- **Pass 4 — Queued worker later**
  - Once synchronous latency and reliability pain are demonstrated, enqueue minimal work.
  - A protected worker claims, processes, retries, and reconciles jobs.
- Explain:
  - Each pass is honest about its current capability.
  - Earlier passes are not “wrong”; they are bounded steps.
  - We do not silently pretend a placeholder is production storage.

### 6. Describe the daily engineering loop

- Present the loop chronologically:
  1. Choose one product outcome.
  2. Create a focused feature branch when the workflow has been introduced.
  3. Implement the smallest production-realistic slice.
  4. Review the change for correctness and scope.
  5. Verify locally with the relevant checks.
  6. Deploy to the appropriate environment.
  7. Verify the deployed user journey.
  8. Capture decisions and known limitations.
- Explain branch/review/verify:
  - Branch isolates focused work.
  - Review asks whether the change matches the intended outcome.
  - Verification gathers evidence from types, lint/build checks, and real behavior.
- Clarify sequencing:
  - The formal staging and branch strategy arrives when the course has enough change to feel the need.
  - The mindset exists from the start even before every workflow layer is introduced.

### 7. Explain the “smallest production-realistic step”

- Define three tests:
  - Does it produce real user value or a necessary operational foundation?
  - Does it acknowledge the most relevant current risk?
  - Can students explain what is intentionally deferred?
- Use an example:
  - One Next.js modular monolith is realistic for the product stage.
  - Starting with many services would add deployment and consistency problems before the product has traffic.
- Maintain a “not now” list:
  - Queue.
  - Advanced caching.
  - Multi-region deployment.
  - Separate backend.
- Emphasize:
  - Deferred is not forgotten.
  - The course roadmap revisits these items when evidence supports them.

## Concepts to define simply for beginners

- **Spiral learning:** returning to an idea at increasing depth as context grows.
- **Vertical slice:** a small feature that crosses the layers needed to deliver user value.
- **Ship:** release and verify a coherent increment in its intended environment.
- **Feedback loop:** use results and failures to guide the next decision.
- **Premature abstraction:** creating a generalized structure before its repeated need is understood.
- **Branch:** an isolated line of Git work used to develop and review a change.
- **Worker:** a process or endpoint that performs work outside the user’s immediate request.

## Concrete examples tied to wazifa.app

- Deployment grows from a single page to custom domains, staging, runtime configuration, and release safety.
- Authentication grows from sign-up/login to session-derived candidate ownership and admin role protection.
- Resume handling grows from placeholder UI to private DigitalOcean Spaces storage and temporary admin access.
- AI grows from synchronous OpenAI screening to later QStash-backed processing with retries and reconciliation.
- The modular monolith remains one deployment while code boundaries become clearer as the product grows.

## What NOT to over-explain or promise

- Do not teach Git commands, queue APIs, storage APIs, auth implementation, or service/repository code here.
- Do not imply every day must deploy regardless of a broken verification result.
- Do not claim synchronous AI is the final scalable architecture.
- Do not label every early implementation “production ready” without stating its limits.
- Do not promise that all complexity can be avoided; explain that it should be earned.
- Do not present microservices as inherently advanced or monoliths as inherently basic.

## Key teaching lines to emphasize

- “Meet the idea simply, use it, then revisit it with real context.”
- “Deployment is part of development, not the final ceremony.”
- “A vertical slice proves integration earlier than disconnected layers.”
- “Introduce patterns after students feel the problem they solve.”
- “Deferred does not mean forgotten.”
- “Choose the smallest production-realistic step.”

## Closing summary

- Spiral learning revisits concepts at deeper levels.
- Shipping creates feedback from real environments.
- Vertical slices keep progress visible and integration honest.
- The course introduces storage, auth, architecture, and scaling patterns when product pain gives them meaning.
- The daily loop is build, review, verify, deploy, observe, and improve.

## Exact transition into the next lecture

> “عرفنا الآن كيف سنتعلم وكيف سننشر، وحان الوقت أن نرى المنتج الذي سيجمع كل هذه الدوائر في قصة واحدة. في المحاضرة التالية سنعمل walkthrough كامل لـ `wazifa.app`: ماذا يفعل المرشح، ماذا يدير الـ admin، وكيف نخدم التجربتين من تطبيق واحد.”

## Recording checklist

- [ ] Draw and explain the simple spiral diagram.
- [ ] Define Ship as release plus verification, not reckless pushing.
- [ ] Explain vertical slices with a `wazifa.app` example.
- [ ] State the “patterns after pain” rule.
- [ ] Cover all four upload/AI progression stages.
- [ ] Explain branch, review, verify, deploy, and observe.
- [ ] Clarify that formal workflow depth arrives incrementally.
- [ ] Name intentionally deferred complexity.
- [ ] End with the exact transition to the product overview.
