type Props = {
  activeJobs: number;
  totalCandidates: number;
  avgScore: string;
  interviews: number;
}

function DashboardStats({ activeJobs, totalCandidates, avgScore, interviews }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mt-8">
      <div className="brutal-border p-5">
        <p className="font-mono text-xs text-muted-foreground">ACTIVE JOBS</p>
        <p className="font-heading text-4xl font-bold mt-1">{activeJobs}</p>
      </div>
      <div className="brutal-border border-l-0 p-5">
        <p className="font-mono text-xs text-muted-foreground">
          TOTAL CANDIDATES
        </p>
        <p className="font-heading text-4xl font-bold mt-1">
          {totalCandidates}
        </p>
      </div>
      <div className="brutal-border border-l-0 p-5">
        <p className="font-mono text-xs text-muted-foreground">AVG AI SCORE</p>
        <p className="font-heading text-4xl font-bold mt-1 text-accent">
          {avgScore}
        </p>
      </div>
      <div className="brutal-border border-l-0 p-5">
        <p className="font-mono text-xs text-muted-foreground">INTERVIEWS</p>
        <p className="font-heading text-4xl font-bold mt-1">{interviews}</p>
      </div>
    </div>
  );
}

export default DashboardStats;
