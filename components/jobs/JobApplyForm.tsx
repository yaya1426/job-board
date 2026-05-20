"use client";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useActionState } from "react";
import {
  handleApplyToJob,
  ApplyToJobState,
} from "@/app/actions/applications/applications.action";
import { useParams } from "next/navigation";
import { TextArea } from "../ui/textarea";
import { UserProfile } from "@/types/UserProfile";
import { User } from "@/types/User";

type Props = {
  userProfile: UserProfile & User;
};


function JobApplyForm({ userProfile }: Props) {
  const { id: jobId } = useParams<{ id: string }>();


  const [state, formAction, isPending] = useActionState<
    ApplyToJobState,
    FormData
  >(handleApplyToJob, undefined);

  return (
    <form action={formAction} className="brutal-border lg:border-l-0 p-8">
      <h3 className="font-heading text-xl font-bold mb-6 border-b-3 border-foreground pb-4">
        APPLY NOW
      </h3>
      <div className="space-y-4">
        <Input type="hidden" name="jobId" value={jobId} />
        <Input
          name="candidateName"
          label="FULL NAME"
          placeholder="YOUR NAME"
          error={state?.errors?.candidateName?.[0]}
          defaultValue={userProfile.name}
        />
        <Input
          name="candidateEmail"
          label="EMAIL"
          placeholder="YOUR@EMAIL.COM"
          error={state?.errors?.candidateEmail?.[0]}
          defaultValue={userProfile.email}
        />
        <Input
          name="candidateLinkedin"
          label="LINKEDIN"
          placeholder="LINKEDIN.COM/IN/..."
          defaultValue={userProfile.linkedin}
          error={state?.errors?.candidateLinkedin?.[0]}
        />
        {/* TODO: add resume file upload */}
        <div>
          <label className="font-heading text-xs font-bold uppercase block mb-2">
            RESUME
          </label>
          <div className="brutal-border border-dashed border-3 p-8 text-center cursor-pointer hover:bg-accent/10 transition-none">
            <p className="font-mono text-sm font-bold">DROP FILE HERE</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              PDF, DOC — MAX 5MB
            </p>
          </div>
        </div>
        <div>
          <label className="font-heading text-xs font-bold uppercase block mb-2">
            COVER NOTE
          </label>
          <TextArea
            name="candidateCoverLetter"
            placeholder="WHY THIS ROLE?"
            error={state?.errors?.candidateCoverLetter?.[0]}
          />
        </div>
        <Button
          type="submit"
          variant="accent"
          className="w-full mt-4"
          disabled={isPending}
        >
          {isPending ? "SUBMITTING..." : "SUBMIT APPLICATION →"}
        </Button>
      </div>
    </form>
  );
}

export default JobApplyForm;
