import { Application } from "@/types/Application";
import { AiScore } from "../BrutalUI";

type Props = {
  application: Application;
};

function ApplicationSubmitted({ application }: Props) {
  const { screeningStatus } = application;

  return (
    <div className="brutal-border lg:border-l-0 p-8">
      <h3 className="font-heading text-xl font-bold border-b-3 border-foreground pb-4">
        APPLICATION SUBMITTED
      </h3>

      <div className="mt-6 bg-accent/10 brutal-border p-5">
        <p className="font-heading font-bold">WE RECEIVED YOUR APPLICATION</p>
        <p className="font-mono text-xs text-muted-foreground mt-2">
          Your resume is stored securely. Screening is waiting to begin.
        </p>
      </div>

      <p className="font-mono text-xs mt-5">
        SCREENING STATUS: <strong>{screeningStatus}</strong>
      </p>

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
          Automated screening could not be completed. Your application is still
          available for review.
        </p>
      )}

      {application.screeningStatus === "COMPLETED" && (
        <div className="mt-6 border-t-3 border-foreground pt-5 space-y-4">
          <div>
            <p className="font-mono text-xs text-muted-foreground">AI SCORE</p>
            <AiScore score={application.aiScore ?? 0} />
          </div>

          <div>
            <p className="font-mono text-xs text-muted-foreground">SUMMARY</p>
            <p className="font-mono text-xs leading-5 mt-2">
              {application.aiSummary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationSubmitted;
