"use client";
import { Input } from "../ui/input";
import { BrutalSelect } from "../BrutalUI";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

function CreateJobForm() {
  const navigate = useRouter();
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "FULL-TIME",
    salary: "",
    description: "",
    requirements: "",
    tags: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate.push("/dashboard/jobs");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 brutal-border p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="JOB TITLE"
          placeholder="e.g. SENIOR FRONTEND ENGINEER"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
        <Input
          label="COMPANY"
          placeholder="e.g. NEXUS LABS"
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="LOCATION"
          placeholder="e.g. REMOTE"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          required
        />
        <BrutalSelect
          label="TYPE"
          value={form.type}
          onChange={(e) => update("type", e.target.value)}
          options={[
            { value: "FULL-TIME", label: "FULL-TIME" },
            { value: "PART-TIME", label: "PART-TIME" },
            { value: "CONTRACT", label: "CONTRACT" },
            { value: "FREELANCE", label: "FREELANCE" },
          ]}
        />
        <Input
          label="SALARY RANGE"
          placeholder="e.g. $140K–$180K"
          value={form.salary}
          onChange={(e) => update("salary", e.target.value)}
          required
        />
      </div>

      <Input
        label="TAGS (COMMA SEPARATED)"
        placeholder="e.g. REACT, TYPESCRIPT, WEBGL"
        value={form.tags}
        onChange={(e) => update("tags", e.target.value)}
      />

      <div>
        <label className="font-heading text-xs font-bold uppercase block mb-2">
          DESCRIPTION
        </label>
        <textarea
          className="w-full brutal-border bg-background px-4 py-3 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px] focus:shadow-accent min-h-[120px] resize-y"
          placeholder="Describe the role, responsibilities, and what makes it exciting..."
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="font-heading text-xs font-bold uppercase block mb-2">
          REQUIREMENTS (ONE PER LINE)
        </label>
        <textarea
          className="w-full brutal-border bg-background px-4 py-3 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px] focus:shadow-accent min-h-[100px] resize-y"
          placeholder={
            "5+ years React\nTypeScript expert\nSystem design skills"
          }
          value={form.requirements}
          onChange={(e) => update("requirements", e.target.value)}
        />
      </div>

      <div className="flex gap-0 pt-4 border-t-3 border-foreground">
        <Button type="submit" variant="accent">
          PUBLISH JOB
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-l-0"
          onClick={() => navigate.push("/dashboard/jobs")}
        >
          CANCEL
        </Button>
      </div>
    </form>
  );
}

export default CreateJobForm;
