import AdminPageHeader from "@/components/common/AdminPageHeader";
import { CandidateData } from "@/data/CandidateData";
import UsersListingWrapper from "@/components/users/UsersListingWrapper";
import { getJobs } from "@/services/jobs/jobs.service";

async function UsersPage() {
  const result = await getJobs();
  if (!result.success) {
    return <div>Error loading jobs</div>;
  }
  const { data: jobs = [] } = result;
  return (
    <>
      <AdminPageHeader
        title="USERS"
        subtitle={`${CandidateData.length} ACTIVE USERS`}
        actionButtonLink="/dashboard/users/new"
        actionButtonVariant="accent"
        actionButtonText="+ CREATE USER"
      />
      <UsersListingWrapper jobs={jobs} />
    </>
  );
}

export default UsersPage;