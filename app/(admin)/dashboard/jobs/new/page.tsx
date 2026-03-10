import AdminPageHeader from "@/components/common/AdminPageHeader";
import CreateNewJobForm from "@/components/job-management/CreateNewJobForm";

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
      <CreateNewJobForm />
    </>
  );
}

export default NewJobPage;
