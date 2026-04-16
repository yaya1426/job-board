import AdminPageHeader from "@/components/common/AdminPageHeader";
import UsersListingWrapper from "@/components/users/UsersListingWrapper";
import { getJobs } from "@/services/jobs/jobs.service";
import { getApplications } from "@/services/applications/applications.service";
import { getCandidates } from "@/services/candidates/candidates.service";

async function UsersPage() {
  const jobsResult = await getJobs();
  const applicationsResult = await getApplications();
  const candidatesResult = await getCandidates();

  if (!jobsResult.success) {
    return <div>Error loading jobs</div>;
  }
  if (!applicationsResult.success) {
    return <div>Error loading applications</div>;
  }

  if (!candidatesResult.success) {
    return <div>Error loading candidates</div>;
  }

  const { data: jobs = [] } = jobsResult;
  const { data: applications = [] } = applicationsResult;
  const { data: candidates = [] } = candidatesResult;

  return (
    <>
      <AdminPageHeader
        title="USERS"
        subtitle={`${candidates.length} ACTIVE USERS`}
        actionButtonLink="/dashboard/users/new"
        actionButtonVariant="accent"
        actionButtonText="+ CREATE USER"
      />
      <UsersListingWrapper
        jobs={jobs}
        applications={applications}
        candidates={candidates}
      />
    </>
  );
}

export default UsersPage;
