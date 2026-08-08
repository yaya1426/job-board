import { NextResponse } from "next/server";
import { analyzeApplicationResume } from "@/services/screening/openai-screening.service";
import { getApplicationById } from "@/services/applications/applications.service";
import { getJob } from "@/services/jobs/jobs.service";

export async function GET() {
  const application = await getApplicationById("6a5a58e9d38aa51365e021d8");
  const job = await getJob("6a044d07bae3884460e67f20");

  if (!application.success || !job.success) {
    return NextResponse.json({ error: "Application or job not found" }, { status: 404 });
  }

  if (!job.data) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (!application.data) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const response = await analyzeApplicationResume({
    application: application.data,
    job: job.data,
  });

  return NextResponse.json({ response });
}
