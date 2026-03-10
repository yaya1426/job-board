import { CandidateData } from "@/data/CandidateData";
import { JobsData } from "@/data/JobsData";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentApplications from "@/components/dashboard/RecentApplications";

function DashboardPage() {
  const interviews = CandidateData.filter(
    (c) => c.status === "INTERVIEW",
  ).length;
  
  const avgScore = (
    CandidateData.reduce((s, c) => s + c.aiScore, 0) / CandidateData.length
  ).toFixed(1);

  return (
    <>
      <h1 className="text-4xl font-heading font-bold">OVERVIEW</h1>
      <p className="font-mono text-sm text-muted-foreground mt-1">
        ADMIN DASHBOARD
      </p>

      <DashboardStats
        activeJobs={JobsData.length}
        totalCandidates={CandidateData.length}
        avgScore={avgScore}
        interviews={interviews}
      />
      <RecentApplications candidates={CandidateData} />
    </>
  );
}

export default DashboardPage;
