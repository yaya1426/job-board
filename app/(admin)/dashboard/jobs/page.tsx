import AdminPageHeader from "@/components/common/AdminPageHeader";
import JobManagementTable from "@/components/job-management/JobManagementTable";
import { getJobs } from "@/services/jobs/jobs.service";

async function JobsManagementPage() {
  const result = await getJobs();

  if (!result.success) {
    return <div>Error loading jobs</div>;
  }

  const { data = [] } = result;

  return (
    <>
      <AdminPageHeader
        title="JOB POSTS"
        subtitle={`${data.length} ACTIVE LISTINGS`}
        actionButtonLink="/dashboard/jobs/new"
        actionButtonVariant="accent"
        actionButtonText="+ CREATE JOB"
      />
      <JobManagementTable jobs={data} />
    </>
  );
}

export default JobsManagementPage;
