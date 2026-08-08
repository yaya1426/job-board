import JobNotFound from "@/components/jobs/JobNotFound";
import Link from "next/link";
import JobDescription from "@/components/jobs/JobDescription";
import JobApplyForm from "@/components/jobs/JobApplyForm";
import { getJob } from "@/services/jobs/jobs.service";
import { getCurrentUserProfile } from "@/services/users/users.service";
import ApplyAuthPrompt from "@/components/jobs/ApplyAuthPrompt";
import { getCurrentUserApplicationForJob } from "@/services/applications/applications.service";
import ApplicationSubmitted from "@/components/jobs/ApplicationSubmitted";

type Props = {
  params: Promise<{ id: string }>;
};

async function JobDetailsPage({ params }: Props) {
  const { id } = await params;
  const result = await getJob(id);
  const userProfileResult = await getCurrentUserProfile();
  const applicationResult = await getCurrentUserApplicationForJob(id);
  const hasApplied = applicationResult.success;

  const application = applicationResult.success
  ? applicationResult.data
  : undefined;

  if (!result.success) {
    return <JobNotFound />;
  }

  const { data: job } = result;

  if (!job) {
    return <JobNotFound />;
  }

  if (!userProfileResult.success || !userProfileResult.data) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          href="/jobs"
          className="font-mono text-sm text-muted-foreground hover:text-accent transition-none"
        >
          ← ALL POSITIONS
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 mt-6">
          <JobDescription job={job} />
          <ApplyAuthPrompt jobId={id} />
        </div>
      </div>
    );
  }

  const { data: userProfile } = userProfileResult;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Link
        href="/jobs"
        className="font-mono text-sm text-muted-foreground hover:text-accent transition-none"
      >
        ← ALL POSITIONS
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 mt-6">
        <JobDescription job={job} />
        {hasApplied && application ? (
          <ApplicationSubmitted application={application} />
        ) : (
          <JobApplyForm userProfile={userProfile} />
        )}
      </div>
    </div>
  );
}

export default JobDetailsPage;
