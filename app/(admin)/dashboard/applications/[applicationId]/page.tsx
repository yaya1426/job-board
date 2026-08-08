import AdminPageHeader from "@/components/common/AdminPageHeader";
import { getApplicationById } from "@/services/applications/applications.service";
import Link from "next/link";
import ApplicationCandidateDetails from "@/components/applications/details/ApplicationCandidateDetails";
import ApplicationWorkflowDetails from "@/components/applications/details/ApplicationWorkflowDetails";
import ApplicationSubmissionDetails from "@/components/applications/details/ApplicationSubmissionDetails";

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

      <div className="mt-8">
        <ApplicationSubmissionDetails application={application} />
      </div>
    </>
  );
}

export default ApplicationDetailsPage;
