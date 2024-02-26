"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { NewPostSchema } from "@/schemas";
import * as z from "zod";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { customAlphabet } from "nanoid";
import sharp from "sharp";

const acceptedFileTypes = ["image/jpeg", "image/png"];
const maxFileSize = 1024 * 1024 * 4; // 4MB

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
});

export async function newPost(newPostData: FormData) {
  const user = await currentUser();
  if (!user || !user.id) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  const image = newPostData.get("image") as File;
  const description = newPostData.get("description") as string;
  const tags = newPostData.getAll("tags[]");

  if (!image) {
    return { error: "No image provided" };
  }
  if (!acceptedFileTypes.includes(image.type)) {
    return { error: "Invalid file type" };
  }
  if (image.size > maxFileSize) {
    return { error: "File too large" };
  }
  if (tags.length === 0) {
    return { error: "No tags provided" };
  }

  const sourcefileExtension = image.type === "image/jpeg" ? ".jpg" : ".png";
  const thumbnailFileExtension = ".webp";
  const folderName = "thumbnails";
  const nanoid = customAlphabet(process.env.NANOID_ALPHABET!, 12);
  const publicId = nanoid();
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

  const sourceUrl = `${process.env.B2_FRIENDLY_URL}/file/${process.env.B2_BUCKET_NAME}/${publicId}${sourcefileExtension}`;
  const thumbnailUrl = `${process.env.B2_FRIENDLY_URL}/file/${process.env.B2_BUCKET_NAME}/${folderName}/${thumbnailName}${thumbnailFileExtension}`;

  const validatedFields = NewPostSchema.safeParse({
    publicId,
    tags,
    sourceUrl,
    thumbnailUrl,
    description,
    width,
    height,
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields", details: validatedFields.error };
  } else {
    try {
      await db.post.create({
        data: {
          publicId,
          sourceUrl,
          thumbnailUrl,
          description,
          width,
          height,
          userId: user.id,
          tags: {
            connectOrCreate: validatedFields.data.tags.map((tag) => {
              return {
                where: { name: tag },
                create: { name: tag },
              };
            }),
          },
        },
      });

      return {
        success: {
          postUrl: `/post/${validatedFields.data.publicId}`,
        },
      };
    } catch (error) {
      // TODO: If adding to database fails, delete uploaded files?
      return { error: "Failed to create post", details: error };
    }
  }
}
