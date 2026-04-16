import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentApplications from "@/components/dashboard/RecentApplications";
import { getJobs } from "@/services/jobs/jobs.service";
import { getApplications } from "@/services/applications/applications.service";

async function DashboardPage() {
  const jobsResult = await getJobs();
  const applicationsResult = await getApplications();

  if (!jobsResult.success) {
    return <div>Error loading jobs</div>;
  }

  if (!applicationsResult.success) {
    return <div>Error loading applications</div>;
  }

  const { data: jobs = [] } = jobsResult;
  const { data: applications = [] } = applicationsResult;
  
  const interviews = applications.filter(
    (c) => c.status === "INTERVIEW",
  ).length;

  const avgScore = (
    applications.reduce((s, c) => s + c.aiScore, 0) /
    applications.length
  ).toFixed(1);

  return (
    <>
      <h1 className="text-4xl font-heading font-bold">OVERVIEW</h1>
      <p className="font-mono text-sm text-muted-foreground mt-1">
        ADMIN DASHBOARD
      </p>

      <DashboardStats
        activeJobs={jobs.length}
        totalCandidates={applications.length}
        avgScore={avgScore}
        interviews={interviews}
      />
      <RecentApplications applications={applications} />
    </>
  );
}

export default DashboardPage;
