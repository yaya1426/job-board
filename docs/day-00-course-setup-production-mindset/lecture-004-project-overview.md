# Lecture 4 — Project Overview | نظرة شاملة على مشروع وظيفة

## Recommended duration

10–12 minutes

## Lecture outcome

Students can describe the `wazifa.app` product, candidate and admin journeys, the public/admin surface split, the modular-monolith boundary, the planned domains, and the feature roadmap without needing source-code knowledge.

## Opening hook

> “بدلاً من بناء عشرين مثالاً منفصلاً، سنجعل منتجاً واحداً ينمو أمامنا. كل قرار في الكورس سيجيب عن حاجة داخل منصة الوظائف `wazifa.app`.”

> “سنرى الآن المنتج كما يراه المستخدم والـ admin، ثم نأخذ نظرة معمارية من ارتفاع مناسب—بدون الدخول في الملفات أو الكود.”

## What to show on screen/slides

- Product title and one-sentence description.
- Two surface cards:
  - `wazifa.app` — public candidate experience
  - `admin.wazifa.app` — internal admin dashboard
- Candidate journey diagram:

```text
Discover jobs → View details → Sign up / log in → Apply with resume → Submission saved
```

- Admin journey diagram:

```text
Admin login → Manage jobs → Review applications → Access private resume → Review AI screening
```

- One-deployment architecture preview:

```text
Public host ─┐
             ├→ One Next.js 16 modular monolith → shared services/data
Admin host ──┘
```

- A roadmap slide grouped by product capabilities, not by libraries.
- A final portfolio-evidence slide: product, architecture, security, deployment, operations.

## Chronological speaking script

### 1. Introduce the product problem

- Describe `wazifa.app`:
  - A job platform connecting candidates with job opportunities and giving an internal team tools to manage the hiring flow.
- Explain why it is a strong course product:
  - Public and private experiences.
  - Read-heavy and write-heavy workflows.
  - Authentication and authorization.
  - Structured data and private files.
  - Third-party AI integration.
  - Real deployment and domain concerns.
- Say:
  - “المشروع ليس نسخة كاملة من LinkedIn، وليس مجرد Todo App. هو نطاق متوسط يسمح لنا أن نرى قرارات حقيقية بدون أن يضيع الكورس في مئات الـ features.”

### 2. Walk through the public candidate surface

- Start at the public home page:
  - Explain the platform’s value.
  - Help candidates discover current roles.
- Move to jobs listing:
  - Browse available jobs.
  - Later support search, filters, and pagination.
- Move to job details:
  - Read title, company, description, location, and requirements.
- Move to authentication:
  - Candidate creates an account or logs in.
  - The return path should bring the candidate back to the intended job.
- Move to applying:
  - Identity and profile data help prefill the form.
  - Candidate adds the application-specific message and resume.
  - The server owns the true candidate identity.
- Complete the journey:
  - Application is persisted as the important user action.
  - Resume is handled privately.
  - AI screening enriches the application but should not erase it when the provider fails.
- Keep focus on outcomes rather than implementation.

### 3. Walk through the admin surface

- Describe the admin dashboard as an internal product surface:
  - Overview of operational hiring data.
  - Jobs management.
  - Applications management.
  - Users/candidates management.
- Jobs flow:
  - Create and review job postings.
  - See derived applicant counts.
- Applications flow:
  - Review candidate submission snapshots.
  - Update application status through the hiring pipeline.
  - Access a private resume through controlled, temporary access.
  - Review AI score and structured screening information.
- Users flow:
  - Understand candidate identity and profile information.
  - Keep identity and editable profile responsibilities distinct.
- State the security boundary:
  - Hiding the link is not authorization.
  - Admin pages and mutations require server-enforced admin role checks.
- Suggested wording:
  - “الـ admin dashboard ليس صفحة مخفية فقط؛ هو سطح له صلاحيات وقواعد مختلفة.”

### 4. Explain the two surfaces and domains

- Preview the intended hostnames:
  - Public: `wazifa.app`.
  - Admin: `admin.wazifa.app`.
  - Development/staging hosts will mirror the distinction later.
- Explain host/subdomain routing simply:
  - The hostname helps decide which product surface a request should enter.
  - Later, Next.js 16 `proxy.ts` will enforce routing and early access rules.
- Keep boundaries clear:
  - URLs and layouts differ.
  - Access rules differ.
  - They still share the same product data and business capabilities.
- Do not teach DNS or proxy logic here.

### 5. Introduce the modular monolith

- Define the starting architecture:
  - One Next.js 16 application.
  - One codebase.
  - One primary deployment unit.
  - Organized into product responsibilities rather than an unstructured pile.
- Define **modular monolith**:
  - “تطبيق واحد يتم نشره كوحدة واحدة، لكن داخله حدود واضحة بين الواجهة، قواعد العمل، والوصول للبيانات.”
- Explain why it fits:
  - Candidate and admin flows share jobs, users, and applications.
  - One team/course can change the full slice together.
  - Fewer distributed-system problems early.
  - Fast feedback and simpler deployment.
- Explain what it does not mean:
  - All code in one file.
  - No architecture.
  - Impossible to extract services later.
- Emphasize:
  - “نختار monolith عن قصد لحجم المنتج الحالي، وليس لأننا لا نعرف البدائل.”

### 6. Preview the capability roadmap

- Group the roadmap into stages:
  - **Foundation:** create, version, deploy, connect domains.
  - **Application structure:** App Router, public/admin routing, layouts, shared UI.
  - **Product experience:** candidate and admin pages with clear journeys.
  - **Backend and data:** Server Actions/Route Handlers, validation, services, repositories, MongoDB.
  - **Identity and access:** NextAuth sessions, candidate ownership, admin role protection.
  - **Files and AI:** private resume storage, temporary access, OpenAI screening.
  - **Discovery and quality:** search, filters, pagination, SEO, performance, caching.
  - **Reach and scale:** multiple languages and later queued AI screening.
- Preview the eventual stack in context:
  - Next.js 16 and React 19 run the application.
  - TypeScript improves contracts.
  - Tailwind/shadcn support the UI system.
  - MongoDB/Mongoose persist product data.
  - Zod validates input.
  - NextAuth handles authentication.
  - DigitalOcean and Cloudflare host and route production traffic.
  - OpenAI processes screening.
- Repeat:
  - This is a map, not today’s implementation lesson.

### 7. Explain what the final product demonstrates

- Product thinking:
  - Two user groups and coherent journeys.
- Full-stack delivery:
  - UI, server behavior, database, file storage, and third-party APIs.
- Architecture:
  - Modular monolith and clear boundaries.
- Security:
  - Session-derived identity, role gates, private files, server checks.
- Reliability:
  - Save important data before optional work and represent failure states.
- Operations:
  - Domains, deployment environments, release workflow, configuration, and scaling evolution.
- Communication:
  - Ability to explain why a simpler approach was chosen first and when it changed.
- Say:
  - “قيمة المشروع ليست في عدد الصفحات، بل في القصة الهندسية التي تستطيع شرحها من أول request حتى التشغيل.”

## Concepts to define simply for beginners

- **Product surface:** a distinct experience for a user group, such as candidates or admins.
- **User journey:** the ordered steps a person takes to achieve a goal.
- **Subdomain:** a named section before the main domain, such as `admin` in `admin.wazifa.app`.
- **Modular monolith:** one deployed application with intentional internal boundaries.
- **Business rule:** a rule the product must enforce, such as only admins creating jobs.
- **Application snapshot:** submitted display information preserved as it was when the candidate applied.
- **Private file:** a file that cannot be accessed through a permanent public link.

## Concrete examples tied to wazifa.app

- A candidate browses jobs publicly, signs in only when needed, and returns to the selected job.
- A submitted application retains job and candidate display information as an audit-style snapshot.
- The admin sees a derived applicant count rather than a manually maintained counter.
- A resume stays private while an authorized admin receives short-lived download access.
- AI screening produces a 0–10 result and structured review, while the application remains valid if screening fails.
- Both domains enter the same deployment but follow distinct layouts and authorization rules.

## What NOT to over-explain or promise

- Do not open route groups, models, services, repositories, or configuration files.
- Do not explain MongoDB schemas, NextAuth callbacks, signed URLs, OpenAI schemas, or queue claims.
- Do not promise parity with a large commercial hiring platform.
- Do not claim AI replaces human hiring judgment.
- Do not imply subdomain separation alone provides authorization.
- Do not suggest the modular monolith must remain forever or must later become microservices.

## Key teaching lines to emphasize

- “One product gives every technical concept a reason to exist.”
- “Public and admin are two surfaces, not two disconnected products.”
- “A modular monolith is one deployment with intentional internal boundaries.”
- “The server owns identity and authorization decisions.”
- “AI enriches the hiring workflow; it does not replace human judgment.”
- “The project’s value is the engineering story, not the page count.”

## Closing summary

- `wazifa.app` serves candidates and administrators.
- Candidates discover jobs, authenticate, and apply with a resume.
- Admins manage the hiring workflow, private resumes, and AI-assisted screening.
- Both surfaces begin in one Next.js modular monolith and later use hostname routing through `proxy.ts`.
- The roadmap progressively introduces product, data, security, operations, and scaling concerns.

## Exact transition into the next lecture

> “أصبح لدينا الآن صورة واضحة للمنتج وحدوده. بقي سؤال تقني أساسي قبل أن نبدأ: لماذا اخترنا Next.js لهذا النوع من التطبيقات؟ في المحاضرة التالية سنشرح أسباب الاختيار بصدق، مع المزايا والتكاليف والحالات التي قد نختار فيها حلاً آخر.”

## Recording checklist

- [ ] Present `wazifa.app` as a focused job platform.
- [ ] Walk through the candidate journey chronologically.
- [ ] Walk through jobs, applications, resumes, AI, and users on the admin side.
- [ ] Show public and admin domain intentions.
- [ ] Define modular monolith without opening code.
- [ ] Preview `proxy.ts` without teaching it.
- [ ] Group the roadmap by capabilities.
- [ ] State that AI assists rather than replaces human judgment.
- [ ] Avoid folder-level or implementation detail.
- [ ] End with the exact transition to why Next.js.
