import AdminPageHeader from "@/components/common/AdminPageHeader";
import EditJobForm from "@/components/job-management/EditJobForm";
import JobNotFound from "@/components/jobs/JobNotFound";
import { JobsData } from "@/data/JobsData";
import { Job } from "@/types";

type Props = {
  params: Promise<{ jobId: string }>;
};

async function EditJobPage({ params }: Props) {
  const { jobId } = await params;
  const job = JobsData.find((job: Job) => job.id === jobId);

  if (!job) {
    return <JobNotFound />;
  }

  return (
    <>
      <AdminPageHeader
        title="EDIT JOB"
        subtitle={`ID: ${job.id} — ${job.title}`}
        actionButtonLink="/dashboard/jobs"
        actionButtonVariant="outline"
        actionButtonText="← BACK"
      />
      <EditJobForm job={job} />
    </>
  );
}

export default EditJobPage;
