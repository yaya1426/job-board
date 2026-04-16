import JobNotFound from "@/components/jobs/JobNotFound";
import Link from "next/link";
import JobDescription from "@/components/jobs/JobDescription";
import JobApplyForm from "@/components/jobs/JobApplyForm";
import { getJob } from "@/services/jobs/jobs.service";

type Props = {
  params: Promise<{ id: string }>;
};

async function JobDetailsPage({ params }: Props) {
  const { id } = await params;
  const result = await getJob(id);

  if (!result.success) {
    return <JobNotFound />;
  }

  const { data: job } = result;

  if (!job) {
    return <JobNotFound />;
  }

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
        <JobApplyForm />
      </div>
    </div>
  );
}

export default JobDetailsPage;
