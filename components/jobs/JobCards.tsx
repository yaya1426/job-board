import Link from "next/link";
import { JobsData } from "@/data";
import { useJobs } from "@/context/jobs/JobsContext";

function JobCards() {
  const { search, typeFilter, locationFilter } = useJobs();

  const filtered = JobsData.filter((j) => {
    const matchSearch =
      !search ||
      j.title.includes(search.toUpperCase()) ||
      j.company.includes(search.toUpperCase()) ||
      j.tags.some((t) => t.includes(search.toUpperCase()));
    const matchType = typeFilter === "ALL" || j.type === typeFilter;
    const matchLocation =
      locationFilter === "ALL" || j.location.includes(locationFilter);
    return matchSearch && matchType && matchLocation;
  });

  return (
    <div className="lg:col-span-3">
      {filtered.length === 0 ? (
        <div className="brutal-border border-l-0 p-16 text-center">
          <h3 className="font-heading text-2xl font-bold">NO JOBS FOUND</h3>
          <p className="font-mono text-sm text-muted-foreground mt-2">
            TRY DIFFERENT FILTERS
          </p>
        </div>
      ) : (
        filtered.map((job, i) => (
          <Link
            href={`/jobs/${job.id}`}
            key={job.id}
            className={`brutal-border lg:border-l-0 ${i > 0 ? "border-t-0" : ""} p-6 flex flex-col md:flex-row justify-between items-start gap-4 hover:bg-accent/10 transition-none group block`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="font-mono text-xs text-muted-foreground">
                  {job.company}
                </p>
                <span className="font-mono text-xs bg-accent text-accent-foreground px-2 py-0.5">
                  {job.type}
                </span>
              </div>
              <h3 className="font-heading text-xl font-bold mt-1 group-hover:text-accent transition-none">
                {job.title}
              </h3>
              <div className="flex gap-2 mt-3 flex-wrap">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs brutal-border-thin px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right flex-shrink-0 md:text-right">
              <p className="font-mono text-sm">{job.location}</p>
              <p className="font-heading text-lg font-bold">{job.salary}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {job.posted} · {job.applicants} APPLICANTS
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default JobCards;
