import { JobsData } from "@/data/JobsData";
import AdminPageHeader from "@/components/common/AdminPageHeader";
import JobManagementTable from "@/components/job-management/JobManagementTable";

function JobsManagementPage() {
  return (
    <>
      <AdminPageHeader
        title="JOB POSTS"
        subtitle={`${JobsData.length} ACTIVE LISTINGS`}
        actionButtonLink="/dashboard/jobs/new"
        actionButtonVariant="accent"
        actionButtonText="+ CREATE JOB"
      />
      <JobManagementTable jobs={JobsData} />
    </>
  );
}

export default JobsManagementPage;
