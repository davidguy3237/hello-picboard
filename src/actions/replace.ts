"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { EditPostSchema, NewPostSchema } from "@/schemas";
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { customAlphabet } from "nanoid";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import * as z from "zod";

if (
  !process.env.B2_ENDPOINT ||
  !process.env.B2_REGION ||
  !process.env.B2_APPLICATION_KEY_ID ||
  !process.env.B2_APPLICATION_KEY
) {
  throw new Error(
    "Missing environment variable: B2_ENDPOINT, B2_REGION, B2_APPLICATION_KEY_ID or B2_APPLICATION_KEY",
  );
}

const acceptedFileTypes = ["image/jpeg", "image/png"];
const maxFileSize = 1024 * 1024 * 4; // 4MB

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

export async function replace(newPostData: FormData) {
  if (
    !process.env.NANOID_ALPHABET ||
    !process.env.B2_BUCKET_NAME ||
    !process.env.NEXT_PUBLIC_PHOTOS_DOMAIN
  ) {
    throw new Error(
      "Missing environment variable: NANOID_ALPHABET, B2_BUCKET_NAME or NEXT_PUBLIC_PHOTOS_DOMAIN",
    );
  }

  const user = await currentUser();
  if (!user || !user.id) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  const image = newPostData.get("image") as File;
  const publicId = newPostData.get("publicId") as string;

  if (!image) {
    return { error: "No image provided" };
  }
  if (!acceptedFileTypes.includes(image.type)) {
    return { error: "Invalid file type" };
  }
  if (image.size > maxFileSize) {
    return { error: "File too large" };
  }

  const sourcefileExtension = image.type === "image/jpeg" ? ".jpg" : ".png";
  const thumbnailFileExtension = ".webp";
  const folderName = "thumbnails";
  // const nanoid = customAlphabet(process.env.NANOID_ALPHABET, 12);
  // const publicId = nanoid();
  const thumbnailName = publicId + "-thumbnail";

  const fileBuffer = Buffer.from(await image.arrayBuffer());

  const { width, height } = await sharp(fileBuffer).metadata();

  const thumbnailWidth = 400;
  const thumbnailObject = await sharp(fileBuffer)
    .resize(thumbnailWidth)
    .webp()
    .toBuffer({ resolveWithObject: true });

  const { data: thumbnailBuffer, info: thumbnailInfo } = thumbnailObject;

  const putSource = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: publicId + sourcefileExtension,
    ContentType: image.type,
    ContentLength: image.size,
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
    return { error: "Failed to upload image", details: error };
  }

  const updatedPost = await db.post.update({
    where: {
      publicId,
    },
    data: {
      width,
      height,
    },
  });
  if (!updatedPost) {
    return {
      error: "There was a problem editing this post",
    };
  } else {
    return {
      success: "Post edited!",
    };
  }
}
