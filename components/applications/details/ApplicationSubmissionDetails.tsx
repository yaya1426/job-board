import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Application } from "@/types";

type Props = {
  application: Application;
};

function ApplicationSubmissionDetails({ application }: Props) {
  const { candidateCoverLetter, candidateResumeKey } = application;
  return (
    <Card>
      <CardHeader>
        <CardTitle>APPLICATION INFORMATION</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="font-mono text-xs text-muted-foreground">
            COVER LETTER
          </p>
          <p className="font-heading text-lg font-bold">
            {candidateCoverLetter}
          </p>
        </div>
        <div>
          <p className="font-mono text-xs text-muted-foreground">RESUME</p>
          <a
            className="font-heading text-lg font-bold hover:underline hover:text-blue-500"
            href={`/dashboard/applications/${application.id}/resume`}
            target="_blank"
          >
            {candidateResumeKey}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default ApplicationSubmissionDetails;
