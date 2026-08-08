import { getCurrentUser } from "@/lib/current-user";
import { NextResponse } from "next/server";
import { getApplicationById } from "@/services/applications/applications.service";
import { createResumeDownloadUrl } from "@/services/uploads/uploads.service";

type RouteContext = {
  params: Promise<{ applicationId: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { applicationId } = await params;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 },
    );
  }

  if (currentUser.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Admin access required" },
      { status: 403 },
    );
  }

  const result = await getApplicationById(applicationId);

  if (!result.success) {
    return NextResponse.json(result.errors, { status: 400 });
  }

  if (!result.data) {
    return NextResponse.json(
      { message: "Application not found" },
      { status: 404 },
    );
  }

  const application = result.data;

  if (!application.candidateResumeKey) {
    return NextResponse.json(
      { message: "Resume not found" },
      { status: 404 },
    );
  }

  const downloadUrl = await createResumeDownloadUrl(
    application.candidateResumeKey
  );

  return NextResponse.redirect(downloadUrl);
}
