import { S3Client } from "@aws-sdk/client-s3";
import { requireEnv } from "./utils";

export const spacesClient = new S3Client({
  endpoint: requireEnv("DO_SPACES_ENDPOINT"),
  region: requireEnv("DO_SPACES_REGION"),
  credentials: {
    accessKeyId: requireEnv("DO_SPACES_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("DO_SPACES_SECRET_ACCESS_KEY"),
  },
});

export const spacesBucket = requireEnv("DO_SPACES_BUCKET");