import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const StatusBadge = ({ status }: { status: string }) => {
  const variantMap: Record<
    string,
    "submitted" | "review" | "shortlist" | "interview" | "rejected"
  > = {
    SUBMITTED: "submitted",
    REVIEW: "review",
    SHORTLIST: "shortlist",
    INTERVIEW: "interview",
    REJECTED: "rejected",
  };

  return <Badge variant={variantMap[status] || "submitted"}>{status}</Badge>;
};

export const AiScore = ({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) => {
  const color =
    score >= 8
      ? "text-accent"
      : score >= 6
        ? "text-warning"
        : "text-destructive";
  const sizeClasses = {
    sm: "text-lg",
    md: "text-3xl",
    lg: "text-5xl",
  };
  return (
    <div className="font-mono font-bold">
      <span className={`${color} ${sizeClasses[size]}`}>
        {score.toFixed(1)}
      </span>
      <span className="text-muted-foreground text-xs">/10</span>
    </div>
  );
};

type BrutalSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
};

export const BrutalSelect = ({
  label,
  options,
  error,
  ...props
}: BrutalSelectProps) => (
  <div>
    {label && (
      <label className="font-heading text-xs font-bold uppercase block mb-2">
        {label}
      </label>
    )}
    <select
      className={cn(
        "w-full brutal-border bg-background px-4 py-3 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px] focus:shadow-accent appearance-none cursor-pointer",
        error && "border-red-500",
      )}
      {...props}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export const MetricBox = ({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) => (
  <div className="brutal-border brutal-shadow p-6 bg-card">
    <p className="font-mono text-xs text-muted-foreground uppercase">{label}</p>
    <p className="font-heading text-4xl font-bold mt-2">{value}</p>
    {sub && (
      <p className="font-mono text-xs text-muted-foreground mt-1">{sub}</p>
    )}
  </div>
);
