# Lecture 3 - Why Next.js for Production Apps? | لماذا نختار Next.js لتطبيقات الإنتاج؟

## Goal

Explain why Next.js is a strong fit for `wazifa.app` at the current product stage, including honest tradeoffs and cases where another architecture may be better.

## Outcome

After reading this lecture, you should understand the product requirements that drove the framework choice, the App Router and server/client mental model at a preview level, the one-deployment advantage, and when a separate backend or another framework may be more appropriate.

## Implementation Status

Orientation — no code changes. Grounded in course product `wazifa.app`.

## Context

Choosing Next.js does not mean it is the best framework for every project. Good engineering starts from product and team requirements, then asks which tool offers the simplest reasonable path to delivery and operation.

For `wazifa.app`, the product needs React for interfaces, server capabilities for data and security, and a unified deployment experience. Next.js is a logical choice—with costs that must be understood.

## Key concepts

### Start from product requirements

Current `wazifa.app` needs:

- Public pages that benefit from server-rendered content and future SEO
- Interactive forms for authentication and applications
- Server-side validation and authorization
- Database access and private provider credentials
- API-style endpoints for external or reusable contracts
- Public and admin experiences that share product rules
- One team and one deployment path at the current stage

Next.js places React UI and useful server capabilities in one framework, reducing coordination overhead for this modular-monolith stage.

The decision starts from product needs, not framework loyalty.

### React plus server capabilities

React remains the UI model: components compose pages; interactive pieces manage browser state and events.

Next.js adds application-level server capabilities:

```text
React UI + server rendering + server operations + routes + deployment unit
```

- File and URL-segment routing
- Server rendering and Server Components
- Server-side mutations and HTTP endpoints
- Metadata and production build behavior

Browser and server still have different trust boundaries. Code location and execution environment remain important even when they live in one repository.

### App Router mental model (preview)

The **App Router** maps the `app/` structure to pages, layouts, loading states, and related behavior.

```text
URL segments → layouts/pages → server by default → client where interaction needs it
```

- **Layouts** — Shared UI wrapping a group of pages; public and admin surfaces can have different shells.
- **Dynamic routes** — A job detail URL can include a job identifier.
- **Server by default** — App Router components are Server Components unless marked otherwise; they can read server-side data without shipping the same logic to the browser.
- **Client opt-in** — Add a client boundary for browser APIs, local state, event handlers, or client hooks.

The question is not whether a page is entirely server or client. The better question: what is the smallest part that must run in the browser?

App Router fundamentals are taught after the first deployment (Day 3).

### Server/client boundaries (preview)

| Concept | Role |
|---|---|
| **Server Components** | Render on the server; use server-only data access through proper layers; pass serializable data across client boundaries |
| **Client Components** | Handle browser interaction, state, and hooks; are not trusted for authorization decisions; must not contain secrets |
| **Server Actions** | Server functions for internal mutations (create job, submit application); still require validation and authorization |
| **Route Handlers** | Explicit HTTP endpoints for webhooks, external consumers, or reusable API contracts |

Server Actions and Route Handlers serve different boundaries—not competing badges.

Typical flow: public page reads jobs in server-owned code → apply form has client interaction → submission invokes a protected server operation → external systems use route handlers when an HTTP contract is required.

### One-deployment advantage

Public host and admin host enter one Next.js application:

```text
wazifa.app ─────┐
                ├→ One Next.js app → shared services/data
admin.wazifa.app ┘
```

Benefits at this stage: shared types and product rules, one build and deployment unit, easier end-to-end changes, less network plumbing between separately deployed services, coherent TypeScript experience.

`proxy.ts` (introduced Day 4) inspects the host and routes requests toward public or admin surfaces with early access checks. One deployment is an architectural choice for the current stage; it does not remove the need for internal boundaries.

### TypeScript and ecosystem

- **TypeScript** — Carries domain shapes through components and server code; catches many mismatches before deployment. Does not validate untrusted runtime input (Zod handles that later).
- **Ecosystem** — React 19, Tailwind/shadcn, Mongoose, NextAuth, OpenAI and object-storage SDKs integrate through common build tooling and conventions.

Popularity is not the primary reason for the choice.

### Production tradeoffs

| Tradeoff | Detail |
|---|---|
| Framework complexity | Server and client code can appear close together, making boundaries easy to misunderstand |
| Caching and rendering | Defaults and framework versions matter; database libraries may not automatically signal dynamic behavior |
| Runtime constraints | Long-running or CPU-heavy work may not fit a request lifecycle; background processing may need workers |
| Platform differences | Deployment capabilities and defaults vary by host |
| Coupling | Server Actions tightly connect internal UI mutations to Next.js; Route Handlers provide clearer HTTP contracts |
| Upgrade cost | Fast framework evolution requires reading release notes and verifying builds |

Full-stack in one framework reduces some complexity; it does not delete complexity. It moves boundaries closer, so they must be made explicit.

### When another architecture may be better

A **separate backend** may fit when:

- Multiple independent clients need a stable shared API (web, mobile, partners)
- Backend and frontend teams deploy independently
- The system has extensive long-running jobs or specialized runtime needs
- Organizational or compliance boundaries require separate services
- Existing domain services already own data and business rules

Another **frontend framework** may fit when the team has stronger expertise elsewhere, the product is primarily static, or the workload is native mobile/desktop.

Next.js can still consume a separate backend. Architecture can evolve without beginning with every possible separation.

Choose the architecture that matches current requirements, team capability, and expected change—not the one with the most impressive diagram.

### Supporting definitions

- **Framework** — A structured set of tools and conventions for building an application.
- **App Router** — Next.js routing model built around the `app` directory and nested layouts.
- **Runtime validation** — Checking real values while the application runs; TypeScript alone cannot do this.
- **Deployment unit** — The artifact or application released together.

## How this applies to wazifa.app

- Job listing and detail pages read data on the server and later expose search-friendly metadata.
- Login and apply forms need focused client interaction while authorization stays server-side.
- Creating jobs and applying fit internal Server Action workflows.
- NextAuth callbacks and provider webhooks use explicit server endpoints where appropriate.
- `wazifa.app` and `admin.wazifa.app` route into one deployment through `proxy.ts`.
- Mongoose access stays behind repository boundaries even though server code is in the same application.
- AI screening starts in a request flow, then moves to a worker when runtime constraints justify it (Day 16).

Next.js supports thin vertical slices: page, server behavior, validation, and deployment evolve together from Day 1.

## Implementation steps

1. Read this lecture alongside [`AGENTS.md`](../../AGENTS.md) §2 (Tech Stack) and §3 (Folder Structure) for the actual versions and layout.
2. Skim the `app/` directory tree to see route groups `(client)` and `(admin)`—details come in Day 3–4 lectures.
3. Note `proxy.ts` at the repository root; hostname routing is taught in Day 4.
4. When reading later lectures, map each feature to the boundary it uses: Server Component, Client Component, Server Action, or Route Handler.
5. Before proposing a separate backend or microservices, check whether the product still matches the "one deployment" criteria listed above.

## Key points

- Choose from product requirements, not framework loyalty.
- React builds the UI; Next.js adds routing and server capabilities around it.
- Keep the client boundary as small as the interaction requires.
- Server Actions and Route Handlers are different contracts, not competing badges.
- One deployment reduces coordination overhead; it does not remove architectural boundaries.
- Full-stack in one framework moves boundaries closer—it does not erase them.

## Verify

- [ ] You can list `wazifa.app` requirements that motivated the Next.js choice.
- [ ] You can distinguish Server Components, Client Components, Server Actions, and Route Handlers.
- [ ] You can explain the one-deployment benefit and its limits.
- [ ] You understand that TypeScript is not runtime validation.
- [ ] You can name cases where a separate backend or another framework may be better.
- [ ] You have not confused preview concepts with implementation details (file structure, directives, deployment commands).

## Out of scope

- File structure, directives, rendering modes, caching APIs, forms, or deployment commands.
- Claiming Next.js is always faster, cheaper, easier, or more scalable.
- Claiming Server Components make APIs or security concerns disappear.
- Claiming one deployment is always simpler at every scale.
- Dismissing separate backends, other frameworks, or microservices.

## Next

[Lecture 4 — Course Method: Spiral + Ship](./lecture-004-course-method-spiral-and-ship.md)
