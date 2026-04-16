import AdminPageHeader from "@/components/common/AdminPageHeader";
import { ApplicationsData } from "@/data/ApplicationsData";
import ApplicationsListingWrapper from "@/components/applications/ApplicationsListingWrapper";
import { getJobs } from "@/services/jobs/jobs.service";

async function ApplicationsManagementPage() {
  const result = await getJobs();
  if (!result.success) {
    return <div>Error loading jobs</div>;
  }
  const { data: jobs = [] } = result;

  return (
    <>
      <AdminPageHeader
        title="APPLICATIONS"
        subtitle={`${ApplicationsData.length} ACTIVE APPLICATIONS`}
        actionButtonLink="/dashboard/users"
        actionButtonVariant="outline"
        actionButtonText="VIEW ALL USERS →"
      />
      <ApplicationsListingWrapper jobs={jobs} />
    </>
  );
}

export default ApplicationsManagementPage;
