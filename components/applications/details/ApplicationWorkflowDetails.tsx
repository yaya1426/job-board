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
          <p className="font-heading text-lg font-bold">{screeningStatus}</p>
        </div>

        {application.screeningStatus === "PENDING" && (
          <p className="font-mono text-sm">SCREENING IS WAITING TO START.</p>
        )}

        {application.screeningStatus === "PROCESSING" && (
          <p className="font-mono text-sm">SCREENING IS IN PROGRESS.</p>
        )}

        {application.screeningStatus === "FAILED" && (
          <p className="font-mono text-sm text-destructive">
            {application.screeningError ?? "SCREENING COULD NOT BE COMPLETED."}
          </p>
        )}

        {application.screeningStatus === "COMPLETED" && (
          <>
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                AI SCORE
              </p>
              <AiScore score={aiScore ?? 0} />
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground">SUMMARY</p>
              <p className="mt-2 font-mono text-sm leading-6">
                {application.aiSummary}
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                STRENGTHS
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5 font-mono text-sm">
                {application?.aiStrengths?.map((strength) => (
                  <li key={strength}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                RISKS / GAPS
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5 font-mono text-sm">
                {application?.aiRisks?.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
          </>
        )}

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
