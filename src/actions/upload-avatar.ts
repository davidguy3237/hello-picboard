"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { customAlphabet } from "nanoid";
import sharp from "sharp";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

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

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: process.env.B2_REGION,
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

const acceptedFileTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
const maxFileSize = 1024 * 1024 * 50; // 4MB

export async function uploadAvatar(uploadAvatarData: FormData) {
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

  const avatarImage = uploadAvatarData.get("avatar") as File;

  if (!avatarImage) {
    return {
      error: "No avatar image provided",
    };
  }
  if (!acceptedFileTypes.includes(avatarImage.type)) {
    return { error: "Invalid file type" };
  }
  if (avatarImage.size > maxFileSize) {
    return { error: "File too large" };
  }

  const fileExtension = ".jpg";
  const folderName = "avatars";
  const nanoid = customAlphabet(process.env.NANOID_ALPHABET, 12);
  const publicId = nanoid();

  const fileBuffer = Buffer.from(await avatarImage.arrayBuffer());

  const resizedAvatarObj = await sharp(fileBuffer)
    .resize(100, 100)
    .jpeg()
    .toBuffer({ resolveWithObject: true });

  const { data: resizedAvatarBuffer, info: resizedAvatarInfo } =
    resizedAvatarObj;

  const putAvatar = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: `${folderName}/${publicId}${fileExtension}`,
    ContentType: avatarImage.type,
    ContentLength: resizedAvatarInfo.size,
    Body: resizedAvatarBuffer,
  });

  try {
    await s3.send(putAvatar);
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to upload image",
    };
  }

  const avatarUrl = `avatars/${publicId}${fileExtension}`;

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      image: avatarUrl,
    },
  });

  revalidatePath("/settings");
  return {
    success: {
      avatarUrl,
    },
  };
}
