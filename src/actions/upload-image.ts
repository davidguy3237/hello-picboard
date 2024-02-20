// https://www.backblaze.com/docs/cloud-storage-use-the-aws-sdk-for-javascript-v3-with-backblaze-b2

"use server";

import { currentUser } from "@/lib/auth";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import * as crypto from "crypto";
import { customAlphabet } from "nanoid";
import sharp from "sharp";

const acceptedTypes = ["image/jpeg", "image/png"];
const maxFileSize = 1024 * 1024 * 4; // 4MB

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
});

export async function uploadImage(ImageFormData: FormData) {
  console.log("INSIDE UPLOAD IMAGE FUNCTION");
  if (!ImageFormData) {
    return { error: "No FormData" };
  }

  const user = currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const file = ImageFormData.get("file") as File;

  if (!file) {
    return { error: "No file provided" };
  }

  if (!acceptedTypes.includes(file.type)) {
    return { error: "Invalid file type" };
  }

  if (file.size > maxFileSize) {
    return { error: "File too large" };
  }

  const sourcefileExtension = file.type === "image/jpeg" ? ".jpg" : ".png";
  const thumbnailFileExtension = ".webp";
  const folderName = "thumbnails";
  const nanoid = customAlphabet(process.env.NANOID_ALPHABET!, 36);
  const fileName = nanoid();
  const thumbnailName = fileName + "-thumbnail";

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const width = 400;
  const thumbnailObject = await sharp(fileBuffer)
    .resize(width)
    .webp({ quality: 50 })
    .toBuffer({ resolveWithObject: true });

  const { data: thumbnailBuffer, info: thumbnailInfo } = thumbnailObject;

  const putSource = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: fileName + sourcefileExtension,
    ContentType: file.type,
    ContentLength: file.size,
    Body: fileBuffer,
  });

  const putThumbnail = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: folderName + "/" + thumbnailName + thumbnailFileExtension,
    ContentType: "image/webp",
    ContentLength: thumbnailInfo.size,
    Body: thumbnailBuffer,
  });

  try {
    await s3.send(putSource);
    await s3.send(putThumbnail);
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }

  return {
    success: {
      sourceUrl: `${process.env.B2_FRIENDLY_URL}/file/${process.env.B2_BUCKET_NAME}/${fileName}${sourcefileExtension}`,
      thumbnailUrl: `${process.env.B2_FRIENDLY_URL}/file/${process.env.B2_BUCKET_NAME}/${folderName}/${thumbnailName}${thumbnailFileExtension}`,
    },
  };
}
