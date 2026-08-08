# Lecture 123 - Display Screening Results in Admin | عرض نتائج التقييم في لوحة الإدارة

## Goal

Make the admin UI tell the truth for every screening state:

```txt
PENDING     -> waiting; no score
PROCESSING  -> running; no score
COMPLETED   -> score /10 + summary + strengths + risks + screenedAt
FAILED      -> safe failure state; no score
```

The candidate experience remains **APPLICATION SUBMITTED**. Candidates do not need provider errors or internal recovery details.

## Step 0 - Restart After Changing the Mongoose Schema

Before testing the new result fields, fully stop and restart the development server:

```bash
# Stop the current server with Ctrl+C
npm run dev
```

The model uses:

```ts
export const ApplicationModel =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
```

This protects Next.js hot reload from recompiling the same model, but it also means the running process can continue using an older compiled schema.

A common symptom is:

```json
{
  "aiScore": 8.5,
  "screeningStatus": "COMPLETED"
}
```

while these newly added fields are missing:

```txt
aiSummary
aiStrengths
aiRisks
screenedAt
```

This happens when the old compiled model already knew about `aiScore` but did not know the new fields. Mongoose strict mode discards update fields that are absent from that compiled schema.

It is not evidence that OpenAI omitted the values. The Zod schema requires all four result properties, so `analyzeApplicationResume()` would throw instead of completing if `summary`, `strengths`, or `risks` were missing.

After restarting:

1. Confirm `aiScore` is optional in the Mongoose schema.
2. Confirm `aiSummary`, `aiStrengths`, `aiRisks`, and `screenedAt` exist in the schema.
3. Confirm `aiScore: 0` was removed from new application creation.
4. Submit a fresh controlled application or deliberately rerun screening for the test record.

Restarting does not backfill a document that was already saved without those fields. The screening update must run again after the correct schema is compiled.

## Step 1 - Replace `ApplicationWorkflowDetails`

Replace `components/applications/details/ApplicationWorkflowDetails.tsx` with:

```tsx
import { StatusBadge } from "@/components/BrutalUI";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Application } from "@/types";

type Props = {
  application: Application;
};

function ApplicationWorkflowDetails({ application }: Props) {
  const completed = application.screeningStatus === "COMPLETED";

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
          <StatusBadge status={application.status} />
        </div>

        <div>
          <p className="font-mono text-xs text-muted-foreground">
            SCREENING STATUS
          </p>
          <p className="font-heading text-lg font-bold">
            {application.screeningStatus}
          </p>
        </div>

        {application.screeningStatus === "PENDING" && (
          <p className="font-mono text-sm">
            SCREENING IS WAITING TO START.
          </p>
        )}

        {application.screeningStatus === "PROCESSING" && (
          <p className="font-mono text-sm">
            SCREENING IS IN PROGRESS.
          </p>
        )}

        {application.screeningStatus === "FAILED" && (
          <p className="font-mono text-sm text-destructive">
            {application.screeningError ??
              "SCREENING COULD NOT BE COMPLETED."}
          </p>
        )}

        {completed && (
          <div className="space-y-5 border-t-3 border-foreground pt-5">
            {application.aiScore !== undefined && (
              <div>
                <p className="font-mono text-xs text-muted-foreground">
                  AI SCORE
                </p>
                <p className="font-heading text-3xl font-bold text-accent">
                  {application.aiScore}/10
                </p>
              </div>
            )}

            {application.aiSummary && (
              <div>
                <p className="font-mono text-xs text-muted-foreground">
                  SUMMARY
                </p>
                <p className="mt-2 font-mono text-sm leading-6">
                  {application.aiSummary}
                </p>
              </div>
            )}

            {application.aiStrengths?.length ? (
              <div>
                <p className="font-mono text-xs text-muted-foreground">
                  STRENGTHS
                </p>
                <ul className="mt-2 list-disc space-y-2 pl-5 font-mono text-sm">
                  {application.aiStrengths.map((strength) => (
                    <li key={strength}>{strength}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {application.aiRisks?.length ? (
              <div>
                <p className="font-mono text-xs text-muted-foreground">
                  RISKS / GAPS
                </p>
                <ul className="mt-2 list-disc space-y-2 pl-5 font-mono text-sm">
                  {application.aiRisks.map((risk) => (
                    <li key={risk}>{risk}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {application.screenedAt && (
              <div>
                <p className="font-mono text-xs text-muted-foreground">
                  SCREENED AT
                </p>
                <p className="font-mono text-sm">
                  {new Date(application.screenedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}

        <div>
          <p className="font-mono text-xs text-muted-foreground">
            APPLIED DATE
          </p>
          <p className="font-heading text-lg font-bold">
            {application.appliedDate}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ApplicationWorkflowDetails;
```

There is no status-label `Record` because the stored values are already readable. Directly displaying `screeningStatus` is the simplest honest UI.

The `completed` guard protects the whole result section. Optional checks inside it also keep legacy or partially migrated documents from crashing.

## Step 2 - Update the Applications Table

Replace `components/applications/ApplicationsTable.tsx` with:

```tsx
import { CheckCircle, Eye, XCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useApplications } from "@/context/applications/ApplicationsContext";

function ApplicationsTable() {
  const { filteredApplications } = useApplications();

  return (
    <div className="mt-6 brutal-border">
      <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] bg-foreground text-background px-4 py-3">
        <span className="font-heading text-xs font-bold">CANDIDATE</span>
        <span className="font-heading text-xs font-bold">APPLIED FOR</span>
        <span className="font-heading text-xs font-bold">DATE</span>
        <span className="font-heading text-xs font-bold">SCREENING</span>
        <span className="font-heading text-xs font-bold">STATUS</span>
        <span className="font-heading text-xs font-bold text-right">
          ACTIONS
        </span>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="p-12 text-center border-t-3 border-foreground">
          <p className="font-heading text-xl font-bold">
            NO APPLICATIONS FOUND
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-2">
            TRY ADJUSTING YOUR FILTERS
          </p>
        </div>
      ) : (
        filteredApplications.map((app) => {
          const statusVariant = app.status.toLowerCase() as
            | "submitted"
            | "review"
            | "shortlist"
            | "interview"
            | "rejected";

          const completedScore =
            app.screeningStatus === "COMPLETED" &&
            app.aiScore !== undefined
              ? `${app.aiScore}/10`
              : null;

          return (
            <div
              key={app.id}
              className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] px-4 py-4 border-t-3 border-foreground items-center hover:bg-muted transition-none"
            >
              <div>
                <p className="font-heading text-sm font-bold">
                  {app.candidateName || "—"}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {app.candidateEmail}
                </p>
              </div>

              <div>
                <p className="font-mono text-xs font-bold">
                  {app.jobTitle || "—"}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {app.jobCompany || "—"}
                </p>
              </div>

              <p className="font-mono text-xs">{app.appliedDate}</p>

              <div>
                <p className="font-heading text-xs font-bold">
                  {app.screeningStatus}
                </p>
                {completedScore && (
                  <p className="font-mono text-xs text-accent">
                    {completedScore}
                  </p>
                )}
              </div>

              <Badge variant={statusVariant}>{app.status}</Badge>

              <div className="flex gap-1 justify-end">
                <Link href={`/dashboard/applications/${app.id}`}>
                  <Button variant="ghost" size="icon" title="VIEW">
                    <Eye size={14} />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" title="SHORTLIST">
                  <CheckCircle size={14} />
                </Button>
                <Button variant="ghost" size="icon" title="REJECT">
                  <XCircle size={14} />
                </Button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ApplicationsTable;
```

The table uses the status as the primary value. It adds `/10` only when a completed application has a real optional score. `0/10` remains valid if OpenAI genuinely returned zero; the important check is `!== undefined`, not truthiness.

## Step 3 - Understand Why the Client Page Looks Stale

The job details page is a Server Component. It fetched:

```ts
const applicationResult = await getCurrentUserApplicationForJob(id);
```

before the candidate submitted the form.

The Server Action saves and screens the application, but the current action does not revalidate or navigate the page. `useActionState` updates only the action state inside `JobApplyForm`; it does not automatically replace the surrounding Server Component tree.

There is also a second issue: `ApplicationSubmitted` currently hardcodes:

```tsx
SCREENING STATUS: <strong>PENDING</strong>
```

Even after a refresh, that component cannot display the real application because it receives no props.

We need to:

1. Revalidate and revisit the job route after successful submission.
2. Pass the real application into `ApplicationSubmitted`.
3. Render status and completed result fields from the database.

## Step 4 - Refresh the Route After the Server Action

Update:

```txt
app/actions/applications/applications.action.ts
```

Add:

```ts
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
```

After the successful `applyToJob()` result:

```ts
export async function handleApplyToJob(
  prevState: ApplyToJobState,
  formData: FormData,
): Promise<ApplyToJobState> {
  const raw = Object.fromEntries(formData);

  const data = {
    ...(raw as unknown as ApplyToJobInput),
  };

  const result = await applyToJob(data);

  if (!result.success) {
    return { errors: result.errors };
  }

  revalidatePath(`/jobs/${data.jobId}`);
  redirect(`/jobs/${data.jobId}`);
}
```

Why use both:

- `revalidatePath()` invalidates the route after the mutation.
- `redirect()` performs a fresh GET of the job page.
- The new render calls `getCurrentUserApplicationForJob()` again.
- The form is replaced by the submitted component without a manual browser refresh.

Call `redirect()` only after the failure check. Do not place it inside a `try/catch`, because Next.js implements redirects by throwing a framework-controlled response.

## Step 5 - Pass the Application to the Submitted Component

Update:

```txt
app/(client)/jobs/[id]/page.tsx
```

Replace:

```ts
const hasApplied = applicationResult.success;
```

with:

```ts
const application = applicationResult.success
  ? applicationResult.data
  : undefined;
```

Then replace:

```tsx
{hasApplied ? (
  <ApplicationSubmitted />
) : (
  <JobApplyForm userProfile={userProfile} />
)}
```

with:

```tsx
{application ? (
  <ApplicationSubmitted application={application} />
) : (
  <JobApplyForm userProfile={userProfile} />
)}
```

The candidate page now renders the application returned by the service instead of only using a boolean.

## Step 6 - Display the Real Candidate Screening State

Replace:

```txt
components/jobs/ApplicationSubmitted.tsx
```

with:

```tsx
import type { Application } from "@/types";

type Props = {
  application: Application;
};

function ApplicationSubmitted({ application }: Props) {
  const completed =
    application.screeningStatus === "COMPLETED" &&
    application.aiScore !== undefined;

  return (
    <div className="brutal-border lg:border-l-0 p-8">
      <h3 className="font-heading text-xl font-bold border-b-3 border-foreground pb-4">
        APPLICATION SUBMITTED
      </h3>

      <div className="mt-6 bg-accent/10 brutal-border p-5">
        <p className="font-heading font-bold">
          WE RECEIVED YOUR APPLICATION
        </p>
        <p className="font-mono text-xs text-muted-foreground mt-2">
          Your resume is stored securely and your application was submitted.
        </p>
      </div>

      <div className="mt-5">
        <p className="font-mono text-xs">
          SCREENING STATUS:{" "}
          <strong>{application.screeningStatus}</strong>
        </p>
      </div>

      {application.screeningStatus === "PENDING" && (
        <p className="font-mono text-xs text-muted-foreground mt-4">
          Screening is waiting to begin.
        </p>
      )}

      {application.screeningStatus === "PROCESSING" && (
        <p className="font-mono text-xs text-muted-foreground mt-4">
          Screening is currently in progress.
        </p>
      )}

      {application.screeningStatus === "FAILED" && (
        <p className="font-mono text-xs text-muted-foreground mt-4">
          Automated screening could not be completed. Your application is
          still available for review.
        </p>
      )}

      {completed && (
        <div className="mt-6 border-t-3 border-foreground pt-5 space-y-4">
          <div>
            <p className="font-mono text-xs text-muted-foreground">
              AI MATCH SCORE
            </p>
            <p className="font-heading text-3xl font-bold text-accent">
              {application.aiScore}/10
            </p>
          </div>

          {application.aiSummary && (
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                SUMMARY
              </p>
              <p className="font-mono text-xs leading-5 mt-2">
                {application.aiSummary}
              </p>
            </div>
          )}

          {application.aiStrengths?.length ? (
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                STRENGTHS
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 font-mono text-xs">
                {application.aiStrengths.map((strength) => (
                  <li key={strength}>{strength}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {application.aiRisks?.length ? (
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                RISKS / GAPS
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 font-mono text-xs">
                {application.aiRisks.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default ApplicationSubmitted;
```

The component displays only safe application data. It does not expose `screeningError`, provider responses, prompts, or internal failures to the candidate.

## Verification

Run:

```bash
npx tsc --noEmit
npm run lint
```

Verify one document for each state:

- `PENDING`: status only; no score or result section.
- `PROCESSING`: in-progress text; no score.
- `COMPLETED`: real optional score `/10`, summary, strengths, risks, and `screenedAt`.
- `FAILED`: safe failure text; no fake score and no provider details.
- A genuine score of `0` displays as `0/10`.
- A legacy record with missing optional result fields does not crash.
- After submitting the form, the route refreshes automatically without a manual browser refresh.
- The apply form is replaced by `ApplicationSubmitted`.
- Candidate and admin views both read the persisted status and completed result.
- Candidate-facing failure UI confirms submission without exposing provider errors.

## Responsible-Use Reminder

The result assists a human reviewer. It must not automatically reject a candidate, infer protected traits, or be presented as objective truth.

## Next

Lecture 124 verifies the synchronous architecture and ships Day 11 through the feature-branch workflow.
