import { resumeUploadRequestSchema } from "./uploads.validation";
import { spacesBucket, spacesClient } from "@/lib/storage";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

export async function uploadResume(file: File) {
  const validated = resumeUploadRequestSchema.parse({
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type,
  });

  // Generate random id
  const id = randomUUID();
  const key = `resumes/${id}.pdf`;
  const bytes = Buffer.from(await file.arrayBuffer());

  await spacesClient.send(
    new PutObjectCommand({
      Bucket: spacesBucket,
      Key: key,
      Body: bytes,
      ContentType: validated.contentType,
    }),
  );

  return {
    key,
    fileName: validated.fileName,
    fileSize: validated.fileSize,
    contentType: validated.contentType,
  };
}

export async function createResumeDownloadUrl(key: string) {
  const objectCommand = new GetObjectCommand({
    Bucket: spacesBucket,
    Key: key,
    ResponseContentType: "application/pdf",
  });

  const expiresIn = { expiresIn: 60 * 15 }; // 15 minutes

  const url = await getSignedUrl(spacesClient, objectCommand, expiresIn);

  return url;
}
