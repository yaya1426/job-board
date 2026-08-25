# Lecture 117 - Application Details and Screening State in Admin | تفاصيل الطلب وحالة التقييم في لوحة الإدارة

## Goal

Turn the applications table's **VIEW** action into a real application details route, then split the page into focused candidate and workflow components.

This lecture stops at the application snapshot and workflow state. Cover-letter/resume presentation and secure private resume access belong to Lecture 118.

## Problem-First Story

The applications table already has an eye action, but the admin needs that action to open the exact application being reviewed.

The details screen should answer two groups of questions:

1. Who applied, and what candidate identity snapshot was submitted?
2. What is the application's current hiring and screening state?

The route should orchestrate data loading while small components own each visual section.

## Files Changed

```txt
components/applications/ApplicationsTable.tsx
components/applications/details/ApplicationCandidateDetails.tsx
components/applications/details/ApplicationWorkflowDetails.tsx
app/(admin)/dashboard/applications/[applicationId]/page.tsx
```

The application lookup already exists:

```txt
services/applications/applications.service.ts -> getApplicationById()
repositories/applications.repository.ts       -> findApplicationById()
```

---

## Implementation Status
**Implemented** — Admin application details route and workflow/candidate components exist.

## Key Files (as implemented today)
- `app/(admin)/dashboard/applications/[applicationId]/page.tsx`
- `components/applications/details/ApplicationCandidateDetails.tsx`
- `components/applications/details/ApplicationWorkflowDetails.tsx`
- `components/applications/ApplicationsTable.tsx`

## Gaps vs This Lecture (if any)
- Cover letter/resume presentation and secure download belong to Lecture 118 (partially wired with a simplified UI).
- `ApplicationWorkflowDetails` already renders COMPLETED AI fields (Lecture 123 overlap) but uses `aiScore ?? 0`.

## Step 1 - Fix the Applications Table VIEW Link

Open:

```txt
components/applications/ApplicationsTable.tsx
```

The eye action must link to the application ID, not a candidate profile or an `/admin` URL:

```tsx
<Link href={`/dashboard/applications/${app.id}`}>
  <Button variant="ghost" size="icon" title="VIEW">
    <Eye size={14} />
  </Button>
</Link>
```

The final destination is:

```txt
/dashboard/applications/{applicationId}
```

Teaching point:

> The admin is reviewing one application snapshot, not the candidate's mutable profile.

---

## Step 2 - Build the Application Details Route

The page stays responsible for orchestration:

```txt
page
  -> read applicationId
  -> call getApplicationById()
  -> handle failure or missing data
  -> render AdminPageHeader
  -> compose detail components
```

The dashboard layout already performs the admin authorization check. The page can focus on loading the requested application.

We will build the two presentation components first and compose them in the route afterward.

---

## Step 3 - Create ApplicationCandidateDetails

Create:

```txt
components/applications/details/ApplicationCandidateDetails.tsx
```

Add:

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Application } from "@/types";

type Props = {
  application: Application;
};

function ApplicationCandidateDetails({ application }: Props) {
  const { candidateName, candidateEmail, candidateLinkedin } = application;
  return (
    <Card>
      <CardHeader>
        <CardTitle>CANDIDATE INFORMATION</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="font-mono text-xs text-muted-foreground">NAME</p>
          <p className="font-heading text-lg font-bold">{candidateName}</p>
        </div>
        <div>
          <p className="font-mono text-xs text-muted-foreground">EMAIL</p>
          <a
            className="font-heading text-lg font-bold hover:underline hover:text-blue-500"
            href={`mailto:${candidateEmail}`}
          >
            {candidateEmail}
          </a>
        </div>
        <div>
          <p className="font-mono text-xs text-muted-foreground">LINKEDIN</p>
          <a
            className="font-heading text-lg font-bold hover:underline hover:text-blue-500"
            href={candidateLinkedin}
            target="_blank"
          >
            {candidateLinkedin}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default ApplicationCandidateDetails;
```

This component displays the candidate fields stored on the application document. It deliberately does not fetch the candidate's current profile.

Why that matters:

```txt
current profile     -> may change later
application snapshot -> records what was submitted at apply time
```

---

## Step 4 - Create ApplicationWorkflowDetails

Create:

```txt
components/applications/details/ApplicationWorkflowDetails.tsx
```

Add:

```tsx
import { AiScore, StatusBadge } from "@/components/BrutalUI";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Application } from "@/types";

type Props = {
  application: Application;
};

function ApplicationWorkflowDetails({ application }: Props) {
  const { screeningStatus, status, aiScore, appliedDate } = application;

  return (
    <Card>
      <CardHeader>
        <CardTitle>APPLICATION WORKFLOW</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="font-mono text-xs text-muted-foreground">
            APPLICATION STATUS
          </p>
          <StatusBadge status={status} />
        </div>
        <div>
          <p className="font-mono text-xs text-muted-foreground">
            SCREENING STATUS
          </p>
          <p className="font-heading text-lg font-bold">
            {screeningStatus ?? "PENDING"}
          </p>
        </div>
        <div>
          <p className="font-mono text-xs text-muted-foreground">AI SCORE</p>
          <AiScore score={aiScore} />
        </div>
        <div>
          <p className="font-mono text-xs text-muted-foreground">
            APPLIED DATE
          </p>
          <p className="font-heading text-lg font-bold">{appliedDate}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ApplicationWorkflowDetails;
```

This component owns the current application status, screening status, transitional AI score display, and applied date.

Important scope note:

> Do not remove the transitional `aiScore: 0` yet. Lecture 122 makes the score optional while persisting real results, and Lecture 123 replaces this transitional UI.

---

## Step 5 - Compose the Details Page

Open:

```txt
app/(admin)/dashboard/applications/[applicationId]/page.tsx
```

Replace the complete file with:

```tsx
import AdminPageHeader from "@/components/common/AdminPageHeader";
import { getApplicationById } from "@/services/applications/applications.service";
import Link from "next/link";
import ApplicationCandidateDetails from "@/components/applications/details/ApplicationCandidateDetails";
import ApplicationWorkflowDetails from "@/components/applications/details/ApplicationWorkflowDetails";

type Props = {
  params: Promise<{ applicationId: string }>;
};

async function ApplicationDetailsPage({ params }: Props) {
  const { applicationId } = await params;

  const result = await getApplicationById(applicationId);

  if (!result.success) {
    return <div>Something went wrong</div>;
  }

  const { data: application } = result;

  if (!application) {
    return <div>Application not found</div>;
  }

  return (
    <>
      <AdminPageHeader
        title={`${application.candidateName} — ${application.candidateEmail}`}
        subtitle={`${application.jobTitle} — ${application.jobCompany}`}
        actionButtonLink="/dashboard/applications"
        actionButtonVariant="outline"
        actionButtonText="← BACK"
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ApplicationCandidateDetails application={application} />
        <ApplicationWorkflowDetails application={application} />
      </div>
    </>
  );
}

export default ApplicationDetailsPage;
```

The `Link` import is present in the current route but is not used. Point it out as a small cleanup opportunity, but do not turn this documentation-only restructuring into an implementation change.

What to explain:

- The page remains a Server Component.
- Next.js 16 provides dynamic route params as a promise.
- The service returns a `ServiceResult`, so the page handles both failure and missing data.
- `AdminPageHeader` keeps the title, subtitle, and back action consistent with the rest of the dashboard.
- The page passes the repository-mapped, serializable `Application` object to presentational components.
- Each component has one visual responsibility and can evolve independently.

---

## Step 6 - Verify the Lecture

### Navigation

1. Visit `/dashboard/applications`.
2. Click the eye icon for an application.
3. Confirm the browser opens:

```txt
/dashboard/applications/{applicationId}
```

4. Click **← BACK** and confirm it returns to `/dashboard/applications`.

### Candidate details

Confirm the page shows the application snapshot:

- candidate name
- candidate email
- candidate LinkedIn value
- job title
- company

Open the email and LinkedIn links and confirm they use the submitted snapshot values.

### Workflow details

Confirm the page shows:

- application status
- screening status
- current transitional AI score
- applied date

### Failure and missing data

1. Use a valid application ID and confirm the page renders.
2. Use an unknown ID and confirm the page renders `Application not found`.
3. Temporarily force a failed service result only if needed while recording, then confirm the page renders `Something went wrong`.

---

## Common Mistakes

- Linking the eye action to the candidate instead of the application.
- Adding `/admin` to a dashboard URL even though host-based routing already owns the admin surface.
- Fetching data separately inside each details component.
- Refetching the current candidate profile instead of displaying the application snapshot.
- Putting the details markup directly into one large route component.
- Adding cover-letter or resume access work before the application details foundation is complete.
- Claiming the fake AI score has been removed when the current code still stores and renders it.

## Key Teaching Lines

> The route loads the application; focused components explain its snapshot and workflow.

> Application details are historical submission data, not a live candidate profile.

> Build the review screen first; add secure access to the submitted private file in the next lecture.

## Next

Lecture 118 adds the cover letter and resume metadata to this details page, demonstrates why the private object URL returns `403`, and creates an admin-only signed resume access route.
