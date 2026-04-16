import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/Job";

type Props = {
  jobs: Job[];
};

function FeaturedJobs({ jobs }: Props) {
  const featuredJobs = jobs.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-heading font-bold">
            FEATURED POSITIONS
          </h2>
          <p className="font-mono text-sm text-muted-foreground mt-2">
            HAND-PICKED BY OUR AI
          </p>
        </div>
        <Link href="/jobs">
          <Button variant="outline">VIEW ALL →</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {featuredJobs.map((job, i) => (
          <Link
            href={`/jobs/${job.id}`}
            key={job.id}
            className={`brutal-border ${i % 2 !== 0 ? "md:border-l-0" : ""} ${i >= 2 ? "border-t-0" : ""} p-6 hover:bg-accent/10 transition-none group`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-mono text-xs text-muted-foreground">
                  {job.company}
                </p>
                <h3 className="font-heading text-xl font-bold mt-1 group-hover:text-accent transition-none">
                  {job.title}
                </h3>
              </div>
              <span className="font-mono text-xs bg-accent text-accent-foreground px-2 py-1 brutal-border">
                {job.type}
              </span>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs brutal-border-thin px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6 font-mono text-sm">
              <span>{job.location}</span>
              <span className="font-bold">{job.salary}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export { FeaturedJobs };