"use client";
import { Job } from "@/types";
import { Card } from "../ui/card";

type Props = {
    job: Job;
}

function JobDescription({ job }: Props) {
  return (
    <div className="lg:col-span-2 brutal-border p-8">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <p className="font-mono text-sm text-muted-foreground">
            {job.company} · {job.location}
          </p>
          <h1 className="font-heading text-4xl font-bold mt-2">{job.title}</h1>
        </div>
        <div className="text-right">
          <span className="font-mono text-xs bg-accent text-accent-foreground px-3 py-1 brutal-border">
            {job.type}
          </span>
          <p className="font-heading text-xl font-bold mt-2">{job.salary}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-6 flex-wrap">
        {job.tags.map((tag) => (
          <span key={tag} className="font-mono text-xs brutal-border px-3 py-1">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-8 border-t-3 border-foreground pt-6">
        <h3 className="font-heading text-lg font-bold mb-4">DESCRIPTION</h3>
        <p className="font-body text-sm leading-relaxed">{job.description}</p>
      </div>

      <div className="mt-8 border-t-3 border-foreground pt-6">
        <h3 className="font-heading text-lg font-bold mb-4">REQUIREMENTS</h3>
        <ul className="space-y-2">
          {job.requirements.map((req, i) => (
            <li key={i} className="font-mono text-sm flex items-start gap-3">
              <span className="text-accent font-bold">→</span> {req}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 border-t-3 border-foreground pt-6">
        <Card className="bg-accent/10">
          <div className="flex items-center gap-4">
            <span className="font-heading text-3xl font-bold text-accent">
              7.8
            </span>
            <div>
              <p className="font-heading text-sm font-bold">
                YOUR AI MATCH SCORE
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                BASED ON YOUR PROFILE & SKILLS
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default JobDescription;
