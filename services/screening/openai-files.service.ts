import { GetObjectCommand } from "@aws-sdk/client-s3";
import { spacesBucket, spacesClient } from "@/lib/storage";
import { toFile } from "openai/uploads";
import { openai } from "@/lib/openai";


export async function uploadResumeToOpenAI(resumeKey: string) {
  const object = await spacesClient.send(
    new GetObjectCommand({
      Bucket: spacesBucket,
      Key: resumeKey,
    }),
  );

  if (!object.Body) {
    throw new Error("Resume object has no body");
  }

  const bytes = await object.Body.transformToByteArray();

  if (bytes.byteLength === 0) {
    throw new Error("Resume object is empty");
  }

  const fileName = resumeKey.split("/").pop();

  const pdf = await toFile(Buffer.from(bytes), fileName, {
    type: "application/pdf",
  });

  const result = await openai.files.create({
    file: pdf,
    purpose: "user_data",
    expires_after: {
      anchor: "created_at",
      seconds: 60 * 60, // 1 hour
    },
  });

  return result;
}
