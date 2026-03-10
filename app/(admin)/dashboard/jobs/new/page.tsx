import AdminPageHeader from "@/components/common/AdminPageHeader";
import CreateJobForm from "@/components/job-management/CreateJobForm";

function NewJobPage() {
  return (
    <>
      <AdminPageHeader
        title="CREATE JOB"
        subtitle="NEW LISTING"
        actionButtonLink="/dashboard/jobs"
        actionButtonVariant="outline"
        actionButtonText="← BACK"
      />
      <CreateJobForm />
    </>
  );
}

export default NewJobPage;
