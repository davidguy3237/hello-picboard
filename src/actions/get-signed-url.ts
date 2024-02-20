// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-s3-request-presigner/
"use server";

import { currentUser } from "@/lib/auth";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { customAlphabet } from "nanoid";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const acceptedTypes = ["image/jpeg", "image/png"];
const maxFileSize = 1024 * 1024 * 4; // 4MB

export async function getSignedURL(
  type: string,
  size: number,
  checksum: string,
) {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: "Unauthorized" };
  }

  if (!acceptedTypes.includes(type)) {
    return { error: "Invalid file type" };
  }

  if (size > maxFileSize) {
    return { error: "File too large" };
  }

  if (!checksum) {
    return { error: "Checksum not provided" };
  }

  const nanoid = customAlphabet(process.env.NANOID_ALPHABET!, 36);
  const fileExtension = type === "image/jpeg" ? ".jpg" : ".png";
  const keyName = nanoid();

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: keyName + fileExtension, // The name of the file when it gets written to S3
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: user.id,
    },
  });

  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  return {
    success: {
      url: signedURL,
      keyName: keyName,
      thumbnailBucket: process.env.AWS_THUMBNAIL_BUCKET_NAME,
      bucketRegion: process.env.AWS_BUCKET_REGION,
    },
  };
}
