import AdminPageHeader from "@/components/common/AdminPageHeader";
import ApplicationsListingWrapper from "@/components/applications/ApplicationsListingWrapper";
import { getJobs } from "@/services/jobs/jobs.service";
import { getApplications } from "@/services/applications/applications.service";
import { getCandidates } from "@/services/candidates/candidates.service";

async function ApplicationsManagementPage() {
  const jobsResult = await getJobs();
  const applicationsResult = await getApplications();
  const candidatesResult = await getCandidates();

  if (!candidatesResult.success) {
    return <div>Error loading candidates</div>;
  }

  if (!jobsResult.success) {
    return <div>Error loading jobs</div>;
  }

  if (!applicationsResult.success) {
    return <div>Error loading applications</div>;
  }

  const { data: jobs = [] } = jobsResult;
  const { data: applications = [] } = applicationsResult;
  const { data: candidates = [] } = candidatesResult;
  return (
    <>
      <AdminPageHeader
        title="APPLICATIONS"
        subtitle={`${applications.length} ACTIVE APPLICATIONS`}
        actionButtonLink="/dashboard/users"
        actionButtonVariant="outline"
        actionButtonText="VIEW ALL USERS →"
      />
      <ApplicationsListingWrapper
        jobs={jobs}
        applications={applications}
        candidates={candidates}
      />
    </>
  );
}

export default ApplicationsManagementPage;
