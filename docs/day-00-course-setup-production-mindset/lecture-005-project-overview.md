# Lecture 5 - Project Overview | نظرة شاملة على مشروع وظيفة

## Goal

Introduce `wazifa.app` as the single product through which every course concept is practiced: user journeys, surfaces, architecture, and capability roadmap.

## Outcome

After reading this lecture, you should be able to describe the `wazifa.app` product, candidate and admin journeys, the public/admin surface split, the modular-monolith boundary, planned domains, and the feature roadmap without needing source-code knowledge.

## Implementation Status

Orientation — no code changes. Grounded in course product `wazifa.app`.

## Context

Instead of building many disconnected examples, one product grows throughout the project. Every technical decision answers a need inside the job platform `wazifa.app`.

This lecture views the product as users and admins see it, then at a suitable architectural altitude—without opening implementation files.

## Key concepts

### Product problem

`wazifa.app` is a job platform connecting candidates with opportunities and giving an internal team tools to manage the hiring flow.

Why it works as a course product:

- Public and private experiences
- Read-heavy and write-heavy workflows
- Authentication and authorization
- Structured data and private files
- Third-party AI integration
- Real deployment and domain concerns

The project is not a full LinkedIn clone and not a Todo app. It is medium scope: enough real decisions to learn from without drowning in hundreds of features.

### Candidate journey (public surface)

```text
Discover jobs → View details → Sign up / log in → Apply with resume → Submission saved
```

| Step | Outcome |
|---|---|
| Home | Platform value proposition; entry to job discovery |
| Jobs listing | Browse available roles; later search, filters, pagination |
| Job details | Title, company, description, location, requirements |
| Authentication | Sign up or log in; return path brings candidate back to the intended job |
| Apply | Profile data prefills form; candidate adds message and resume; server owns true identity |
| Complete | Application persisted; resume handled privately; AI enriches but does not erase on failure |

### Admin journey (internal surface)

```text
Admin login → Manage jobs → Review applications → Access private resume → Review AI screening
```

| Area | Capabilities |
|---|---|
| Dashboard | Operational hiring overview |
| Jobs | Create and review postings; derived applicant counts |
| Applications | Review submission snapshots; update status through hiring pipeline; temporary private resume access; AI score and structured screening |
| Users | Candidate identity and profile; identity and editable profile kept distinct |

The admin dashboard is not merely a hidden page. It is a surface with different permissions and rules. Hiding a link is not authorization—admin pages and mutations require server-enforced role checks.

### Two surfaces and domains

| Host | Surface |
|---|---|
| `wazifa.app` | Public candidate experience |
| `admin.wazifa.app` | Internal admin dashboard |
| `dev.wazifa.app` / `dev-admin.wazifa.app` | Staging mirrors (Day 7) |

Hostname helps decide which product surface a request enters. `proxy.ts` (Day 4) enforces routing and early access rules.

Boundaries differ (URLs, layouts, access rules) while sharing the same product data and business capabilities.

### Modular monolith

One Next.js 16 application, one codebase, one primary deployment unit, organized into product responsibilities.

**Modular monolith** — One deployed application with intentional internal boundaries between UI, business rules, and data access.

Why it fits now:

- Candidate and admin flows share jobs, users, and applications
- One team can change the full slice together
- Fewer distributed-system problems early
- Fast feedback and simpler deployment

What it does not mean: all code in one file, no architecture, or impossible service extraction later. The monolith is chosen deliberately for current product size, not from ignorance of alternatives.

```text
Public host ─┐
             ├→ One Next.js modular monolith → shared services/data
Admin host ──┘
```

### Capability roadmap

Grouped by product capabilities, not libraries:

| Stage | Capabilities |
|---|---|
| Foundation | Create, version, deploy, connect domains |
| Application structure | App Router, public/admin routing, layouts, shared UI |
| Product experience | Candidate and admin pages with clear journeys |
| Backend and data | Server Actions/Route Handlers, validation, services, repositories, MongoDB |
| Identity and access | NextAuth sessions, candidate ownership, admin role protection |
| Files and AI | Private resume storage, temporary access, OpenAI screening |
| Discovery and quality | Search, filters, pagination, SEO, performance, caching |
| Reach and scale | Multiple languages; queued AI screening |

Eventual stack in context: Next.js 16 and React 19 run the application; TypeScript improves contracts; Tailwind/shadcn support the UI; MongoDB/Mongoose persist data; Zod validates input; NextAuth handles authentication; DigitalOcean and Cloudflare host and route traffic; OpenAI processes screening.

This is a map, not today's implementation lesson.

### What the final product demonstrates

| Area | Evidence |
|---|---|
| Product thinking | Two user groups and coherent journeys |
| Full-stack delivery | UI, server behavior, database, file storage, third-party APIs |
| Architecture | Modular monolith with clear boundaries |
| Security | Session-derived identity, role gates, private files, server checks |
| Reliability | Important data saved before optional work; failure states represented |
| Operations | Domains, environments, release workflow, configuration, scaling evolution |
| Communication | Explaining why a simpler approach was chosen first and when it changed |

The project's value is the engineering story from first request through operation—not page count.

### Supporting definitions

- **Product surface** — A distinct experience for a user group (candidates or admins).
- **User journey** — The ordered steps a person takes to achieve a goal.
- **Subdomain** — A named section before the main domain, such as `admin` in `admin.wazifa.app`.
- **Business rule** — A rule the product must enforce (for example, only admins create jobs).
- **Application snapshot** — Submitted display information preserved as it was when the candidate applied.
- **Private file** — A file that cannot be accessed through a permanent public link.

## How this applies to wazifa.app

- A candidate browses jobs publicly, signs in only when needed, and returns to the selected job.
- A submitted application retains job and candidate display information as an audit-style snapshot.
- The admin sees a derived applicant count rather than a manually maintained counter.
- A resume stays private while an authorized admin receives short-lived download access.
- AI screening produces a 0–10 result and structured review; the application remains valid if screening fails.
- Both domains enter the same deployment but follow distinct layouts and authorization rules.

For current implementation status at any point in this project, see [`AGENTS.md`](../../AGENTS.md) §11 (Course Day-by-Day Progress).

## Implementation steps

1. Read this lecture to build a mental map of the product before writing code.
2. Skim [`AGENTS.md`](../../AGENTS.md) §1 (Project Overview) and §3 (Folder Structure) for how surfaces map to route groups.
3. Note `proxy.ts` at the repository root; full hostname routing is covered in Day 4 lectures.
4. Browse `app/(client)/` and `app/(admin)/dashboard/` at a high level when you begin Day 3–6 work—do not dive into implementation details yet.
5. Use the capability roadmap table above to orient yourself when starting each new day folder under `docs/`.
6. Proceed to Day 1: [Lecture 6 — Create Next.js App](../day-01-first-deployment/lecture-006-create-nextjs-app.md).

## Key points

- One product gives every technical concept a reason to exist.
- Public and admin are two surfaces, not two disconnected products.
- A modular monolith is one deployment with intentional internal boundaries.
- The server owns identity and authorization decisions.
- AI enriches the hiring workflow; it does not replace human judgment.
- The project's value is the engineering story, not the page count.

## Verify

- [ ] You can describe `wazifa.app` in one sentence.
- [ ] You can walk through the candidate journey end to end.
- [ ] You can walk through the admin journey end to end.
- [ ] You can name the public and admin hostnames and explain why they differ.
- [ ] You can define modular monolith without opening code.
- [ ] You understand `proxy.ts` is previewed here and taught in Day 4.
- [ ] You can group the roadmap by capabilities, not libraries.
- [ ] You know Day 1 begins with a real deployment, not weeks of local-only setup.

## Out of scope

- Route groups, models, services, repositories, or configuration files.
- MongoDB schemas, NextAuth callbacks, signed URLs, OpenAI schemas, or queue claims.
- Parity with a large commercial hiring platform.
- Claiming AI replaces human hiring judgment.
- Implying subdomain separation alone provides authorization.
- Suggesting the modular monolith must remain forever or must become microservices.

## Next

Day 0 ends here. Continue with Day 1:

[Lecture 6 — Create Next.js App (TypeScript + App Router)](../day-01-first-deployment/lecture-006-create-nextjs-app.md)
