import { Candidate } from "@/types/Candidate";

type Props = {
  candidates: Candidate[];
}

function RecentApplications({ candidates }: Props) {
  return (
    <div className="mt-8">
      <h3 className="font-heading text-lg font-bold mb-4">
        RECENT APPLICATIONS
      </h3>
      <div className="brutal-border">
        {candidates.slice(0, 6).map((c, i) => (
          <div
            key={c.id}
            className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t-3 border-foreground" : ""} hover:bg-accent/10 transition-none`}
          >
            <div className="flex items-center gap-4">
              <span className="font-heading text-sm font-bold">{c.name}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {c.role}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-accent">
                {c.aiScore.toFixed(1)}
              </span>
              <span
                className={`${
                  c.status === "SHORTLIST"
                    ? "bg-accent text-accent-foreground"
                    : c.status === "INTERVIEW"
                      ? "bg-info text-info-foreground"
                      : c.status === "REJECTED"
                        ? "bg-destructive text-destructive-foreground"
                        : c.status === "REVIEW"
                          ? "bg-warning text-warning-foreground"
                          : "bg-muted text-foreground"
                } px-2 py-0.5 font-mono text-xs font-bold`}
              >
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentApplications;
