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
