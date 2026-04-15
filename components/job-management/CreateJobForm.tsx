"use client";
import { Input } from "../ui/input";
import { TextArea } from "../ui/textarea";
import { BrutalSelect } from "../BrutalUI";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  handleCreateJob,
  CreateJobState,
} from "@/app/actions/jobs/jobs.action";
import { useActionState } from "react";

function CreateJobForm() {
  const navigate = useRouter();

  const [state, formAction, isPending] = useActionState<
    CreateJobState,
    FormData
  >(handleCreateJob, undefined);

  return (
    <form action={formAction} className="mt-8 brutal-border p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="JOB TITLE"
          name="title"
          placeholder="e.g. SENIOR FRONTEND ENGINEER"
          error={state?.errors?.title?.[0]}
        />
        <Input
          label="COMPANY"
          name="company"
          placeholder="e.g. NEXUS LABS"
          error={state?.errors?.company?.[0]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="LOCATION"
          name="location"
          placeholder="e.g. REMOTE"
          error={state?.errors?.location?.[0]}
        />
        <BrutalSelect
          label="TYPE"
          name="type"
          error={state?.errors?.type?.[0]}
          options={[
            { value: "", label: "SELECT TYPE" },
            { value: "FULL-TIME", label: "FULL-TIME" },
            { value: "PART-TIME", label: "PART-TIME" },
            { value: "CONTRACT", label: "CONTRACT" },
            { value: "FREELANCE", label: "FREELANCE" },
          ]}
        />
        <Input
          label="SALARY RANGE"
          name="salary"
          placeholder="e.g. $140K–$180K"
          error={state?.errors?.salary?.[0]}
        />
      </div>

      <Input
        label="TAGS (COMMA SEPARATED)"
        name="tags"
        placeholder="e.g. REACT, TYPESCRIPT, WEBGL"
        error={state?.errors?.tags?.[0]}
      />

      <div>
        <label className="font-heading text-xs font-bold uppercase block mb-2">
          DESCRIPTION
        </label>
        <TextArea
          name="description"
          placeholder="Describe the role, responsibilities, and what makes it exciting..."
          error={state?.errors?.description?.[0]}
        />
      </div>

      <div>
        <label className="font-heading text-xs font-bold uppercase block mb-2">
          REQUIREMENTS (ONE PER LINE)
        </label>
        <TextArea
          name="requirements"
          placeholder={
            "5+ years React\nTypeScript expert\nSystem design skills"
          }
          error={state?.errors?.requirements?.[0]}
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
