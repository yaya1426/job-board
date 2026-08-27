# Lecture 1 - Welcome: Market-Ready Engineer | أهلاً بك: من متابع شروحات إلى مهندس جاهز لسوق العمل

## Goal

Define what this course builds toward and who it is for, before any implementation begins.

## Outcome

After reading this lecture, you should understand the difference between a tutorial follower and a market-ready engineer, the prerequisites for this project, how the repository and `docs/` folder support learning, and what the project can realistically promise.

## Implementation Status

Orientation — no code changes. Grounded in course product `wazifa.app`.

## Context

Completing many tutorials does not automatically mean you can build and operate a real product. This course closes the gap between code that works in a lesson and engineering decisions that hold up when users, deployments, and failures are real.

The course does not guarantee employment. It builds practical evidence: a complete product, a repeatable workflow, and language for explaining engineering choices.

## Key concepts

- **Tutorial follower** — Can repeat steps when the a fixed lesson path is known. A useful learning stage, not a failure. The limitation appears when requirements change, errors are unfamiliar, or deployment behaves differently from localhost.
- **Market-ready engineer** — Can break a product requirement into a small deliverable, choose a reasonable approach and explain the tradeoff, verify behavior rather than assuming it works, and ship, debug, maintain, and improve a deployed application.
- **Product requirement** — A user or business outcome the software must support.
- **Tradeoff** — Gaining one benefit while accepting a cost or limitation.
- **Repository** — The version-controlled home of the project and its history.
- **Deployment** — Making a specific version of the application run in an environment users can reach.
- **Source of truth** — The place treated as the current accurate state.

Market-ready does not mean knowing every technology. It means learning inside a project and turning an unstructured problem into a buildable, testable step.

### Tutorial vs engineering: one example

Both modes might start with a job-application form UI. The difference is what happens after submit:

| Tutorial mode | Engineering mode |
|---|---|
| Styled inputs | Server-side validation |
| Console log on submit | Signed-in candidate identified on the server |
| — | Application persisted |
| — | Resume stored privately |
| — | Failure handled without losing the submission |
| — | Flow verified on the deployed URL |

Engineers keep asking: Who is allowed? Where does data live? What happens when a dependency fails? Can we debug the deployed result? Is the smallest current solution still safe enough for its stage?

The course does not jump to the most complex answer for every question on day one. It also does not ignore those questions as if the app will always live on localhost.

## How this applies to wazifa.app

- A candidate can browse jobs without knowing how data is stored.
- Applying requires identity, validation, persistence, and a protected resume—not only a styled form.
- An admin can review applications, but a candidate must never gain that access.
- AI screening is useful only when failure does not silently destroy the candidate's application.
- Public and admin experiences share one codebase while preserving clear boundaries.

By the end of the course, one product evolves through: a public jobs experience, authentication and applications, an admin dashboard, private resume handling, AI-assisted screening, and real deployment with domains, validation, persistence, and release practices.

The eventual stack (Next.js 16, React 19, TypeScript, Tailwind/shadcn, MongoDB/Mongoose, Zod, NextAuth, DigitalOcean, Cloudflare, OpenAI) is a roadmap. Each tool enters when it solves a clear product problem.

## Implementation steps

1. Read this lecture to understand the project destination and audience.
2. Skim [`AGENTS.md`](../../AGENTS.md) at the repository root for the current architecture snapshot and what is actually implemented.
3. Browse [`docs/index.md`](../index.md) for the day-by-day lecture index.
4. Confirm you meet the prerequisites: HTML/CSS, modern JavaScript, React fundamentals, basic Git, and comfort running terminal commands.
5. Note what is **not** required: prior Next.js production experience, MongoDB, Docker, DNS, authentication, storage, or OpenAI experience.
6. Adopt the learning routine used throughout the project:
   - Read the lecture for reasoning and the next incremental change.
   - Build along in the repository rather than only copying final files.
   - Pause to predict what should happen before running code.
   - Compare behavior, not merely file text.
   - Deploy and test the real URL when a day requires it.
7. Remember that deployed behavior matters: environment variables, cookies, domains, network calls, and builds expose issues localhost may hide.

### Audience

This course benefits junior and intermediate React developers, frontend developers moving toward full-stack work, developers who have built tutorials but not owned an end-to-end deployment, and instructors or team members who want a production-minded project reference.

### Three sources of truth

| Source | Role |
|---|---|
| Lecture (`docs/day-*/lecture-*.md`) | Reasoning and the next incremental change |
| Repository | Working source of truth at each stage |
| Day documentation | Decisions, narrative, verification, and handoff |

## Key points

- Market-ready is demonstrated through decisions and delivery, not tutorial completion.
- You do not need to know everything; you need a reliable way to learn and ship.
- The product is the laboratory, and deployed behavior is part of the lesson.
- Complexity is introduced when the product earns it.
- This course promises practice and evidence—not guaranteed employment.

## Verify

- [ ] You can explain "market-ready" without treating it as a job guarantee.
- [ ] You can contrast tutorial-following with engineering-oriented product work.
- [ ] You know the prerequisites and what prior experience is not required.
- [ ] You can name the three sources: lectures, repository, and day docs.
- [ ] You understand the learning routine: read → build → predict → compare → deploy.
- [ ] You can preview `wazifa.app` flows at a high level without opening implementation files.

## Out of scope

- App Router, proxy, database schema, auth callbacks, storage signing, or OpenAI API details.
- Claiming the final architecture is the only valid architecture.
- Implying completion makes someone senior.
- Guaranteeing jobs, freelance clients, salary outcomes, or production with zero incidents.
- Presenting every future tool as mandatory for every Next.js product.
- A long JavaScript refresher.

## Next

[Lecture 2 — What is Production Ready?](./lecture-002-what-is-production-ready.md)
